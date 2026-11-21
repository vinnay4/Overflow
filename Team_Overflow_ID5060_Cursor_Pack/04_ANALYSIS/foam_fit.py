"""
foam_fit.py — turn the baseline video into the model's two unknowns.

1) Static decay (best, simplest): when foam is high, cut the heat; read foam height every 1-2 s from the video
   against a ruler taped to the pot. Fit H(t) = H0*exp(-t/tau)  ->  Sigma = tau/eps.
   CSV: data/foam_decay.csv  (template: data/foam_decay_template.csv)
2) Dynamic rise: foam height vs time while heating at known power. Initial slope ~ U_g/eps (check vs model).
   CSV: data/foam_height.csv (template: data/foam_height_template.csv)

  python foam_fit.py --demo     # runs on an internally generated EXAMPLE curve (clearly labelled)
"""
import sys, os
import numpy as np, pandas as pd

EPS = 0.85
def fit_decay(t, h):
    m = h > 0
    k, b = np.polyfit(t[m], np.log(h[m]), 1)
    tau = -1 / k
    return tau, np.exp(b)

if "--demo" in sys.argv:
    rng = np.random.default_rng(1)
    t = np.arange(0, 20, 1.0); h = 6.0 * np.exp(-t / 3.9) * (1 + 0.05 * rng.standard_normal(t.size))
    tau, h0 = fit_decay(t, h)
    print(f"EXAMPLE (synthetic) decay fit: tau = {tau:.2f} s, H0 = {h0:.2f} cm -> Sigma = tau/eps = {tau/EPS:.2f} s")
    sys.exit()
p = "data/foam_decay.csv"
if not os.path.exists(p): sys.exit("data/foam_decay.csv not found — fill it from your video (see 09_HOME_TRIAL_KIT/TRIAL_PROTOCOL.md §4)")
d = pd.read_csv(p)
for tid, g in d.groupby("trial_id"):
    tau, h0 = fit_decay(g.t_after_heat_off_s.to_numpy(float), g.foam_height_cm.to_numpy(float))
    print(f"{tid}: tau = {tau:.2f} s  ->  Sigma = {tau/EPS:.2f} s   (put this into Params.sigma0_s + sigma_skin_s)")
