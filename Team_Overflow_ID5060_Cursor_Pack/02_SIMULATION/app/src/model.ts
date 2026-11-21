/**
 * model.ts — lumped model of milk heating to a boil, with boil-over.
 * Port of 04_ANALYSIS/milk_model.py — keep both in sync (tests/model.test.ts checks key numbers).
 *
 * MODEL OUTPUTS ARE ESTIMATES, NOT MEASUREMENTS. Parameters tagged ASSUMPTION are placeholders
 * the team must replace with values fitted to their own baseline trials.
 */

// ---------- physical constants (SOURCE — see 02_SIMULATION/PARAMETERS.md) ----------
export const RHO_MILK = 1030; // kg/m3 (Goff, U. Guelph Dairy Science eBook)
export const CP_MILK = 3900; // J/kg/K (Minim et al. 2002, J. Chem. Eng. Data: 3.4-4.1 kJ/kg/K)
export const T_BOIL_MILK = 100.5; // degC (Sankar, TNCMPF, The Hindu 2014)
export const RHO_VAP = 0.598; // kg/m3 saturated steam 100 C (Engineering ToolBox)
export const H_FG = 2.257e6; // J/kg (Engineering ToolBox)
export const RHO_WATER_100 = 958; // kg/m3
export const CP_STEEL = 500; // J/kg/K (Engineering ToolBox ~477-515)

export type Stove = "gas" | "induction";
export type Response = "human" | "auto";

export interface Params {
  volumeMl: number;
  potDcm: number;
  potHcm: number;
  potMassKg: number;
  stove: Stove;
  knobPowerW: number;
  efficiency: number;
  tAmb: number;
  tStart: number;
  hLoss: number;
  burnerTauS: number;
  tSkinOnset: number;
  kSkin: number;
  sigma0S: number;
  sigmaSkinS: number;
  epsGas: number;
  gCenterBelowBoil: number;
  gWidth: number;
  disc: boolean;
  discSigmaFactor: number;
  discPeriodS: number;
  stirPeriodS: number;
  lidExtraCm: number;
  autoLowAtC: number;
  lowPowerW: number;
  detector: boolean;
  detectorTriggerC: number;
  response: Response;
  humanResponseS: number;
  dt: number;
  tMax: number;
  stopOnOverflow: boolean;
  holdBoilS: number;
}

export const DEFAULTS: Params = {
  volumeMl: 500, // team deck scope 250-500 mL
  potDcm: 14, // ASSUMPTION — measure your pot
  potHcm: 10, // ASSUMPTION — measure your pot
  potMassKg: 0.35, // ASSUMPTION — weigh your pot
  stove: "gas",
  knobPowerW: 1740, // IS 4246: at least one burner >= 1490 kcal/h (1.74 kW)
  efficiency: 0.68, // IS 4246: min 64 %, 68 % declarable; induction BEE min 80 %
  tAmb: 30, // ASSUMPTION
  tStart: 8, // ASSUMPTION — milk from fridge
  hLoss: 12, // ASSUMPTION — calibrate with measured time-to-boil
  burnerTauS: 8, // ASSUMPTION — gas+grate lag; induction ~1-2 s
  tSkinOnset: 70, // whey denaturation significant > 70-75 C (Singh 2007)
  kSkin: 1 / 45, // ASSUMPTION
  sigma0S: 0.6, // ASSUMPTION — foaminess without skin
  sigmaSkinS: 4.0, // ASSUMPTION — extra foaminess from intact skin
  epsGas: 0.85, // ASSUMPTION — gas fraction in foam
  gCenterBelowBoil: 2.0, // ASSUMPTION
  gWidth: 0.7, // ASSUMPTION
  disc: false,
  discSigmaFactor: 0.45, // ASSUMPTION — TO BE MEASURED
  discPeriodS: 3,
  stirPeriodS: 0,
  lidExtraCm: 0,
  autoLowAtC: 0,
  lowPowerW: 350,
  detector: false,
  detectorTriggerC: 88, // ASSUMPTION — set from measured cue-to-boil lead time
  response: "human",
  humanResponseS: 15, // ASSUMPTION — time yourselves
  dt: 0.05,
  tMax: 900,
  stopOnOverflow: true,
  holdBoilS: 60,
};

export const area = (p: Params) => (Math.PI * (p.potDcm / 100) ** 2) / 4;
export const massKg = (p: Params) => RHO_MILK * p.volumeMl * 1e-6;
export const hLiq = (p: Params) => (p.volumeMl * 1e-6) / area(p);
export const hHead = (p: Params) => p.potHcm / 100 + p.lidExtraCm / 100 - hLiq(p);

export function gVapour(T: number, p: Params): number {
  if (T >= T_BOIL_MILK) return 1;
  const x = (T - (T_BOIL_MILK - p.gCenterBelowBoil)) / p.gWidth;
  return 1 / (1 + Math.exp(-x));
}

export interface Series {
  t: number[];
  T: number[];
  S: number[];
  H: number[];
  P: number[];
  Pi: number[];
  fill: number[];
}
export interface Events {
  firstBoil: number | null;
  overflow: number | null;
  alarm: number | null;
  knobChange: number | null;
  maxFill: number;
  reachedBoil: boolean;
}
export interface Result {
  series: Series;
  events: Events;
  params: Params;
}

export function simulate(pIn: Partial<Params> = {}): Result {
  const p: Params = { ...DEFAULTS, ...pIn };
  let T = p.tStart, S = 0, H = 0, Pf = 0, t = 0;
  let knob = p.knobPowerW;
  const s: Series = { t: [], T: [], S: [], H: [], P: [], Pi: [], fill: [] };
  const ev: Events = { firstBoil: null, overflow: null, alarm: null, knobChange: null, maxFill: 0, reachedBoil: false };
  const C = massKg(p) * CP_MILK + p.potMassKg * CP_STEEL;
  const A = area(p);
  const head = hHead(p);
  const side = Math.PI * (p.potDcm / 100) * (p.potHcm / 100);
  let lastDisc = 0, lastStir = 0;
  let boilEnd: number | null = null;
  while (t < p.tMax) {
    if (p.autoLowAtC && T >= p.autoLowAtC && knob > p.lowPowerW) {
      knob = p.lowPowerW;
      ev.knobChange ??= t;
    }
    if (p.detector && ev.alarm === null && T >= p.detectorTriggerC) ev.alarm = t;
    if (p.detector && ev.alarm !== null) {
      const delay = p.response === "auto" ? 0 : p.humanResponseS;
      if (t >= ev.alarm + delay && knob > p.lowPowerW) {
        knob = p.lowPowerW;
        ev.knobChange ??= t;
      }
    }
    Pf += (knob * p.efficiency - Pf) * Math.min(1, p.dt / Math.max(p.burnerTauS, 1e-6));
    const exposed = A + side * 0.5;
    const L = p.hLoss * exposed * (T - p.tAmb);
    const g = gVapour(T, p);
    const net = Pf - L;
    const dT = net > 0 || T > p.tAmb ? ((1 - g) * net) / C : net / C;
    T = Math.min(T + dT * p.dt, T_BOIL_MILK);
    const Qv = (g * Math.max(net, 0)) / (RHO_VAP * H_FG);
    const Ug = Qv / A;
    const drive = Math.max(0, (T - p.tSkinOnset) / (T_BOIL_MILK - p.tSkinOnset));
    S += p.kSkin * drive * (1 - S) * p.dt;
    if (p.stirPeriodS && t - lastStir >= p.stirPeriodS) {
      S *= 0.1; H *= 0.3; lastStir = t;
    }
    let sigma = p.sigma0S + p.sigmaSkinS * S;
    if (p.disc && g > 0.05) {
      sigma *= p.discSigmaFactor;
      if (t - lastDisc >= p.discPeriodS) { S *= 0.6; lastDisc = t; }
    }
    const tau = sigma * p.epsGas;
    H += (Ug / p.epsGas - H / Math.max(tau, 1e-6)) * p.dt;
    H = Math.max(H, 0);
    const Pi = (sigma * Ug) / Math.max(head, 1e-6);
    if (ev.firstBoil === null && g > 0.5) { ev.firstBoil = t; boilEnd = t + p.holdBoilS; }
    const fill = H / Math.max(head, 1e-6);
    ev.maxFill = Math.max(ev.maxFill, fill);
    s.t.push(t); s.T.push(T); s.S.push(S); s.H.push(H); s.P.push(Pf); s.Pi.push(Pi); s.fill.push(Math.min(fill, 1.2));
    if (H >= head && ev.overflow === null) {
      ev.overflow = t;
      if (p.stopOnOverflow) break;
    }
    if (boilEnd !== null && t >= boilEnd) break;
    t += p.dt;
  }
  ev.reachedBoil = ev.firstBoil !== null;
  return { series: s, events: ev, params: p };
}

/** Pi_BO = Sigma * Qv / V_free  (>1 ⇒ steady foam height exceeds the headroom ⇒ boil-over) */
export function boilOverNumber(sigmaS: number, netPowerW: number, potDcm: number, potHcm: number, volumeMl: number, lidExtraCm = 0): number {
  const A = (Math.PI * (potDcm / 100) ** 2) / 4;
  const vFree = (A * (potHcm + lidExtraCm)) / 100 - volumeMl * 1e-6;
  const qv = netPowerW / (RHO_VAP * H_FG);
  return (sigmaS * qv) / vFree;
}

/** t* = -tau ln(1 - 1/Pi) : time from steady steaming to overflow. Infinity if Pi <= 1 (Approach-a-Limit). */
export function timeToOverflow(sigmaS: number, eps: number, netPowerW: number, potDcm: number, potHcm: number, volumeMl: number): number {
  const pi = boilOverNumber(sigmaS, netPowerW, potDcm, potHcm, volumeMl);
  return pi <= 1 ? Infinity : -sigmaS * eps * Math.log(1 - 1 / pi);
}

/** Steam volume made per second at a given net power (Magnify: 1 mL water -> ~1.6 L steam). */
export const steamLps = (netPowerW: number) => (netPowerW / (RHO_VAP * H_FG)) * 1000;
export const expansionRatio = () => RHO_WATER_100 / RHO_VAP;

/** Named scenarios used by the "Compare alternatives" table (same as 04_ANALYSIS/param_sweep.py) */
export const SCENARIOS: { id: string; label: string; transformer: string; p: Partial<Params> }[] = [
  { id: "baseline", label: "Baseline: full flame, nobody watching", transformer: "—", p: {} },
  { id: "wide", label: "A. Wider pot (20 cm)", transformer: "Scale", p: { potDcm: 20 } },
  { id: "lowflame", label: "B. Heat-flux rule: auto low at 92 °C", transformer: "Change Frame", p: { autoLowAtC: 92 } },
  { id: "disc", label: "C. Milk-watcher disc (effect ASSUMED)", transformer: "Perturb", p: { disc: true } },
  { id: "stir", label: "D. Break film every 10 s (needs a person)", transformer: "Perturb", p: { stirPeriodS: 10 } },
  { id: "lid", label: "E. Containment lid (+4 cm)", transformer: "Scale", p: { lidExtraCm: 4 } },
  { id: "detector", label: "F. Ubaal app v1 (chosen): alarm at 88 °C + 15 s human", transformer: "Change Frame + Approach a Limit", p: { detector: true } },
  { id: "detector_late", label: "F'. App alarm too late (95 °C)", transformer: "Approach a Limit", p: { detector: true, detectorTriggerC: 95 } },
  { id: "auto", label: "G. Auto power-cut on induction (relay)", transformer: "Change Frame", p: { stove: "induction", knobPowerW: 1600, efficiency: 0.8, burnerTauS: 1.5, detector: true, response: "auto", detectorTriggerC: 97 } },
  { id: "hybrid", label: "H. Ubaal app + disc (refinement v2)", transformer: "Change Frame + Perturb", p: { detector: true, disc: true } },
];
