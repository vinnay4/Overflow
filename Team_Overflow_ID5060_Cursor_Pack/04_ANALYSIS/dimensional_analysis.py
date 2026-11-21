"""
dimensional_analysis.py — Scale / Magnify / Approach-a-Limit transformers for the boil-over problem.

Buckingham-pi (course slide style: k variables, r dimensions -> k-r groups)
  Variables: H_e [L] steady foam height, Sigma [T] foaminess (bubble lifetime), Q_v [L^3 T^-1] steam rate,
             A [L^2] pot cross-section, h_head [L] headroom above the milk.
  k = 5, r = 2 (L, T)  ->  3 dimensionless groups:
     pi1 = H_e / h_head            (how full the headroom gets)
     pi2 = Sigma*Q_v / (A*h_head)  = Sigma*Q_v / V_free   (the boil-over number, Pi_BO)
     pi3 = A / h_head^2            (pot aspect ratio)
  Bikerman's linear foam law H_e = Sigma*U_g (U_g = Q_v/A) gives pi1 = pi2, i.e. overflow iff Pi_BO > 1.
Outputs figures to ./figures (all stamped MODEL ESTIMATE).
"""
import math, os
import numpy as np
import matplotlib.pyplot as plt
import style
from milk_model import RHO_VAP, H_FG, RHO_WATER_100, boil_over_number, time_to_overflow

style.apply()
os.makedirs("figures", exist_ok=True)
NET_FULL = 1740 * 0.68   # W, 1.74 kW LPG burner x 68 % (IS 4246)
NET_LOW = 350 * 0.68
SIG = 4.6                # s, ASSUMPTION (Sigma0 + Sigma_skin)

print("== Buckingham pi ==")
print("k=5 variables (H_e, Sigma, Q_v, A, h_head), r=2 dimensions (L,T) -> 3 groups")
print("pi1=H_e/h_head, pi2=Sigma*Q_v/(A*h_head)=Pi_BO, pi3=A/h_head^2 ; Bikerman: pi1 = pi2")

print("\n== Magnify ==")
ratio = RHO_WATER_100 / RHO_VAP
qv = NET_FULL / (RHO_VAP * H_FG)
print(f"expansion ratio rho_l/rho_v = {ratio:.0f}  (1 mL water -> {ratio/1000:.2f} L steam)")
print(f"at {NET_FULL:.0f} W net: water boiled {NET_FULL/H_FG*1000:.2f} g/s -> steam {qv*1000:.2f} L/s")
A = math.pi * 0.14**2 / 4; vfree = A * 0.10 - 500e-6
print(f"14x10 cm pot, 500 mL: free volume {vfree*1000:.2f} L -> fills in {vfree/qv:.2f} s if no bubble bursts")

print("\n== Scale ==")
for d in (12, 14, 16, 20, 24):
    print(f"D={d:>2} cm: Pi_full={boil_over_number(SIG, NET_FULL, d, 10, 500):5.2f}  Pi_low={boil_over_number(SIG, NET_LOW, d, 10, 500):5.2f}")
pmax = {d: 1 / boil_over_number(SIG, 1.0, d, 10, 500) for d in (14, 20)}
print("max net power with Pi<1 (W):", {k: round(v) for k, v in pmax.items()})

print("\n== Approach a limit ==")
for pi in (1.01, 1.1, 1.5, 2, 4, 8):
    tau = SIG * 0.85
    print(f"Pi={pi:<4}: t* = {-tau*math.log(1-1/pi):6.2f} s")

# ---- figures ----
D = np.linspace(10, 26, 120)
fig, ax = plt.subplots(figsize=(7, 4.2))
ax.semilogy(D, [boil_over_number(SIG, NET_FULL, d, 10, 500) for d in D], color=style.RED, lw=2.5, label="full flame (1.18 kW net)")
ax.semilogy(D, [boil_over_number(SIG, NET_LOW, d, 10, 500) for d in D], color=style.BLUE, lw=2.5, label="turned to sim (0.24 kW net)")
ax.axhline(1, color=style.INK, ls="--"); ax.text(10.2, 1.08, "Π = 1: boil-over threshold", fontsize=10)
ax.set_xlabel("pot inner diameter D (cm)  [500 mL, 10 cm tall pot]"); ax.set_ylabel("boil-over number Π = ΣQᵥ/V_free")
ax.set_title("Scale: a wider pot helps; less heat helps more"); ax.legend(frameon=False); style.stamp(ax)
fig.tight_layout(); fig.savefig("figures/fig_scale_pi_vs_diameter.png"); plt.close(fig)

P = np.linspace(100, 2200, 200)
fig, ax = plt.subplots(figsize=(7, 4.2))
ax.plot(P, P / (RHO_VAP * H_FG) * 1000, color=style.ACCENT, lw=2.5, label="steam produced (L/s)")
ax.plot(P, vfree / (P / (RHO_VAP * H_FG)), color=style.INK, lw=2, ls="--", label="seconds to fill 1 L headspace (no bursting)")
ax.set_ylim(0, 8); ax.set_xlim(0, 2200)
ax.set_xlabel("net power into the milk (W)"); ax.set_ylabel("L/s   |   s")
ax.set_title(f"Magnify: 1 mL of water → {ratio/1000:.1f} L of steam"); ax.legend(frameon=False); style.stamp(ax)
fig.tight_layout(); fig.savefig("figures/fig_magnify_steam.png"); plt.close(fig)

pis = np.linspace(1.002, 10, 500); tau = SIG * 0.85
fig, ax = plt.subplots(figsize=(7, 4.2))
ax.semilogy(pis, -tau * np.log(1 - 1 / pis), color="#7c3aed", lw=2.5)
ax.axhline(15, color=style.ACCENT, ls="--"); ax.text(6, 17, "human response ≈15 s (ASSUMED)", color=style.ACCENT, fontsize=10)
ax.axvline(1, color=style.INK, lw=1)
ax.set_xlabel("Π (boil-over number)"); ax.set_ylabel("time from steady steaming to overflow t* (s)")
ax.set_title("Approach a Limit: t* = −τ·ln(1 − 1/Π) → ∞ as Π → 1"); style.stamp(ax)
fig.tight_layout(); fig.savefig("figures/fig_limit_tstar.png"); plt.close(fig)
print("\nfigures written: fig_scale_pi_vs_diameter.png, fig_magnify_steam.png, fig_limit_tstar.png")
