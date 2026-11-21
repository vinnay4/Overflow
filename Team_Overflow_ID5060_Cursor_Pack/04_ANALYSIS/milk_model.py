"""
milk_model.py — lumped-parameter model of a pot of milk heating to a boil.

THIS IS A MODEL, NOT A MEASUREMENT. Every output is an ESTIMATE. Parameters
marked ASSUMPTION are placeholders that the team must replace with values
fitted to their own baseline trials (see 09_HOME_TRIAL_KIT). Parameters marked
SOURCE carry a citation in 02_SIMULATION/PARAMETERS.md.

The same equations are implemented in TypeScript in
02_SIMULATION/app/src/model.ts — keep the two in sync (see test_model_parity).

State variables
  T  bulk milk temperature [degC]
  S  skin (protein-fat film) coverage index, 0..1 [-]
  H  foam layer height above the liquid surface [m]
  Pf burner power actually reaching the pot [W] (lags the knob: thermal inertia)

Governing equations (see 02_SIMULATION/EQUATIONS.md for derivation)
  (m c_m + m_p c_p) dT/dt = (1-g(T)) * (Pf - L(T))
  Qv  = g(T) * max(Pf - L, 0) / (rho_v * h_fg)          steam volume rate [m3/s]
  Ug  = Qv / A                                           superficial velocity [m/s]
  dS/dt = k_s * r(T) * (1-S)  - breaking terms
  dH/dt = Ug/eps - H/tau(S)        (Bikerman dynamic foam balance)
  Sigma(S) = tau/eps = Sigma0 + Sigma_skin*S             foaminess [s]
  overflow when  h_liq + H >= H_pot (+ h_lid if a containment lid is used)
  Pi_BO = Sigma*Ug/h_head = Sigma*Qv/V_free   (boil-over number; >1 => overflow at steady state)
"""
from __future__ import annotations
from dataclasses import dataclass, field, asdict
import math

# ---------------- physical constants (SOURCE) ----------------
RHO_MILK = 1030.0      # kg/m3, whole/toned milk at 20 C (Goff, Dairy Science & Technology eBook, U. Guelph)
CP_MILK = 3900.0       # J/kg/K, typical whole milk; measured range 3.4-4.1 kJ/kg/K (Minim et al., J. Chem. Eng. Data 47 (2002) 1488)
T_BOIL_MILK = 100.5    # degC at sea level (S.R. Sankar, TN Co-op Milk Producers' Federation, The Hindu 2014)
RHO_VAP = 0.598        # kg/m3, saturated steam at 100 C (Engineering ToolBox steam table)
H_FG = 2.257e6         # J/kg, latent heat of vaporisation at 100 C (Engineering ToolBox steam table)
RHO_WATER_100 = 958.0  # kg/m3, saturated liquid water at 100 C (steam tables)
CP_STEEL = 500.0       # J/kg/K, stainless steel near room temp (~477-515 J/kg/K, Engineering ToolBox)


@dataclass
class Params:
    # ---- scenario (team sets these; values below are ASSUMPTIONS until measured) ----
    volume_ml: float = 500.0          # milk volume (team deck scope: 250-500 mL)
    pot_d_cm: float = 14.0            # inner diameter  ASSUMPTION - MEASURE YOUR POT
    pot_h_cm: float = 10.0            # inner height    ASSUMPTION - MEASURE YOUR POT
    pot_mass_kg: float = 0.35         # ASSUMPTION - WEIGH YOUR POT
    stove: str = "gas"                # "gas" or "induction"
    knob_power_w: float = 1740.0      # gas: IS 4246 requires >=1 burner >= 1490 kcal/h = 1.74 kW (SOURCE)
    efficiency: float = 0.68          # gas: IS 4246 min 64%, 68% declarable (SOURCE); induction BEE min 80%
    t_amb: float = 30.0               # degC ASSUMPTION (Chennai kitchen)
    t_start: float = 8.0              # degC milk from fridge ASSUMPTION - MEASURE
    h_loss: float = 12.0              # W/m2/K lumped convective+radiative loss ASSUMPTION - CALIBRATE w/ time-to-boil
    burner_tau_s: float = 8.0         # s, lag of delivered heat after knob change (gas+grate+pot) ASSUMPTION
    # ---- milk physics (ASSUMPTIONS to fit from baseline video) ----
    t_skin_onset: float = 70.0        # degC, whey (b-Lg) denaturation becomes significant >70-75 C (SOURCE: Singh 2007 Lait)
    k_skin: float = 1 / 45.0          # 1/s skin growth rate at full drive ASSUMPTION
    sigma0_s: float = 0.6             # s, foaminess of milk with no skin ASSUMPTION
    sigma_skin_s: float = 4.0         # s, extra foaminess from intact skin ASSUMPTION
    eps_gas: float = 0.85             # gas volume fraction of the foam ASSUMPTION
    g_center_below_boil: float = 2.0  # K, centre of subcooled->saturated vapour transition ASSUMPTION
    g_width: float = 0.7              # K, width of that transition ASSUMPTION
    # ---- interventions (toggles) ----
    disc: bool = False                # milk-watcher disc (Perturb): cuts sigma, ruptures skin periodically
    disc_sigma_factor: float = 0.45   # ASSUMPTION - effect size TO BE MEASURED
    disc_period_s: float = 3.0        # rattle/burst period ASSUMPTION
    stir_period_s: float = 0.0        # 0 = never; >0 = film broken every N s (Perturb, needs a human)
    lid_extra_cm: float = 0.0         # containment lid (e.g. silicone flower) adds headroom ASSUMPTION
    auto_low_at_c: float = 0.0        # 0=off; reduce power to low_power_w once T >= this (heat-flux control)
    low_power_w: float = 350.0        # knob power after reduction ("sim")
    detector: bool = False            # acoustic detector (Change Frame)
    detector_trigger_c: float = 88.0  # temperature at which the detector cue fires ASSUMPTION - MEASURE
    response: str = "human"           # "human" (alarm -> person turns knob) or "auto" (power cut, induction+relay)
    human_response_s: float = 15.0    # alarm -> hand on knob ASSUMPTION - MEASURE (time yourselves)
    dt: float = 0.05
    t_max: float = 900.0
    stop_on_overflow: bool = True
    hold_boil_s: float = 60.0          # how long to keep heating after first boil before ending the run

    # derived
    @property
    def area(self):
        return math.pi * (self.pot_d_cm / 100) ** 2 / 4

    @property
    def mass(self):
        return RHO_MILK * self.volume_ml * 1e-6

    @property
    def h_liq(self):
        return self.volume_ml * 1e-6 / self.area

    @property
    def h_head(self):
        return self.pot_h_cm / 100 + self.lid_extra_cm / 100 - self.h_liq

    @property
    def wetted_side(self):
        return math.pi * self.pot_d_cm / 100 * self.pot_h_cm / 100


def g_vapour(T, p: Params):
    """Fraction of net heat that leaves as steam reaching the surface (0 subcooled -> 1 at boil)."""
    tb = T_BOIL_MILK
    x = (T - (tb - p.g_center_below_boil)) / p.g_width
    return 1.0 / (1.0 + math.exp(-x)) if T < tb else 1.0


def simulate(p: Params):
    T, S, H = p.t_start, 0.0, 0.0
    knob = p.knob_power_w
    Pf = 0.0
    t = 0.0
    out = dict(t=[], T=[], S=[], H=[], P=[], Pi=[], Ug=[])
    events = dict(first_boil=None, overflow=None, alarm=None, knob_change=None,
                  max_H=0.0, max_fill=0.0)
    C = p.mass * CP_MILK + p.pot_mass_kg * CP_STEEL
    A = p.area
    last_disc = 0.0
    last_stir = 0.0
    boil_end = None
    while t < p.t_max:
        # ---- control logic ----
        if p.auto_low_at_c and T >= p.auto_low_at_c and knob > p.low_power_w:
            knob = p.low_power_w
            events["knob_change"] = events["knob_change"] or t
        if p.detector and events["alarm"] is None and T >= p.detector_trigger_c:
            events["alarm"] = t
        if p.detector and events["alarm"] is not None:
            delay = 0.0 if p.response == "auto" else p.human_response_s
            if t >= events["alarm"] + delay and knob > p.low_power_w:
                knob = p.low_power_w
                events["knob_change"] = events["knob_change"] or t
        # burner lag (gas: grate+flame; induction: near-instant)
        Pf += (knob * p.efficiency - Pf) * min(1.0, p.dt / max(p.burner_tau_s, 1e-6))
        # ---- heat balance ----
        exposed = A + p.wetted_side * 0.5
        L = p.h_loss * exposed * (T - p.t_amb)
        g = g_vapour(T, p)
        net = Pf - L
        dT = (1 - g) * net / C if net > 0 or T > p.t_amb else net / C
        T = min(T + dT * p.dt, T_BOIL_MILK)
        Qv = g * max(net, 0.0) / (RHO_VAP * H_FG)
        Ug = Qv / A
        # ---- skin ----
        drive = max(0.0, (T - p.t_skin_onset) / (T_BOIL_MILK - p.t_skin_onset))
        S += p.k_skin * drive * (1 - S) * p.dt
        if p.stir_period_s and t - last_stir >= p.stir_period_s:
            S *= 0.1; H *= 0.3; last_stir = t
        sigma = p.sigma0_s + p.sigma_skin_s * S
        if p.disc and g > 0.05:
            sigma *= p.disc_sigma_factor
            if t - last_disc >= p.disc_period_s:
                S *= 0.6; last_disc = t
        tau = sigma * p.eps_gas
        # ---- foam (Bikerman dynamic balance) ----
        H += (Ug / p.eps_gas - H / max(tau, 1e-6)) * p.dt
        H = max(H, 0.0)
        Pi = sigma * Ug / max(p.h_head, 1e-6)
        if events["first_boil"] is None and g > 0.5:
            events["first_boil"] = t
            boil_end = t + p.hold_boil_s
        events["max_H"] = max(events["max_H"], H)
        events["max_fill"] = max(events["max_fill"], H / max(p.h_head, 1e-6))
        for k, v in (("t", t), ("T", T), ("S", S), ("H", H), ("P", Pf), ("Pi", Pi), ("Ug", Ug)):
            out[k].append(v)
        if H >= p.h_head and events["overflow"] is None:
            events["overflow"] = t
            if p.stop_on_overflow:
                break
        if boil_end is not None and t >= boil_end:
            break
        t += p.dt
    events["reached_boil"] = events["first_boil"] is not None
    return out, events


def boil_over_number(sigma_s, net_power_w, pot_d_cm, pot_h_cm, volume_ml, lid_extra_cm=0.0):
    """Pi_BO = Sigma * Qv / V_free. >1 => foam equilibrium height exceeds headroom."""
    A = math.pi * (pot_d_cm / 100) ** 2 / 4
    v_free = A * (pot_h_cm + lid_extra_cm) / 100 - volume_ml * 1e-6
    qv = net_power_w / (RHO_VAP * H_FG)
    return sigma_s * qv / v_free


def time_to_overflow(sigma_s, eps, net_power_w, pot_d_cm, pot_h_cm, volume_ml):
    """Closed form from dH/dt = Ug/eps - H/tau, H(0)=0:  t* = -tau*ln(1 - 1/Pi). inf if Pi<=1."""
    pi = boil_over_number(sigma_s, net_power_w, pot_d_cm, pot_h_cm, volume_ml)
    tau = sigma_s * eps
    return math.inf if pi <= 1 else -tau * math.log(1 - 1 / pi)


if __name__ == "__main__":
    p = Params()
    out, ev = simulate(p)
    print("MODEL ESTIMATE (not a measurement):", {k: (round(v, 2) if isinstance(v, float) else v) for k, v in ev.items()})
