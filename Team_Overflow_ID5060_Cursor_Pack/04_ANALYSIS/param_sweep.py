"""
param_sweep.py — run the model across scenarios and parameter grids. ALL OUTPUTS ARE MODEL ESTIMATES.
Writes figures/fig_scenarios_foam.png, figures/fig_map_power_diameter.png, figures/fig_map_cue_response.png,
figures/model_scenarios.csv
"""
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import style
from milk_model import Params, simulate

style.apply(); os.makedirs("figures", exist_ok=True)

SCEN = [
    ("baseline", "Baseline: full flame, unattended", {}),
    ("wide", "A. Wider pot 20 cm", dict(pot_d_cm=20)),
    ("lowflame", "B. Auto low at 92 °C", dict(auto_low_at_c=92)),
    ("disc", "C. Disc (Σ×0.45 ASSUMED)", dict(disc=True)),
    ("stir", "D. Break film every 10 s", dict(stir_period_s=10)),
    ("lid", "E. Containment lid +4 cm", dict(lid_extra_cm=4)),
    ("detector", "F. Ubaal app v1: cue 88 °C + 15 s human", dict(detector=True)),
    ("detector_late", "F'. App cue 95 °C (too late)", dict(detector=True, detector_trigger_c=95)),
    ("auto", "G. Induction auto power-cut", dict(stove="induction", knob_power_w=1600, efficiency=0.8, burner_tau_s=1.5, detector=True, response="auto", detector_trigger_c=97)),
    ("hybrid", "H. App + disc (refinement v2)", dict(detector=True, disc=True)),
]
rows = []
fig, ax = plt.subplots(figsize=(9, 5))
for sid, label, kw in SCEN:
    out, ev = simulate(Params(stop_on_overflow=False, **kw))
    t = np.array(out["t"]); fill = np.minimum(np.array(out["H"]) / Params(**kw).h_head, 1.25)
    lead = (ev["first_boil"] - ev["alarm"]) if (ev["alarm"] is not None and ev["first_boil"] is not None) else None
    rows.append(dict(id=sid, scenario=label, boil_over=ev["overflow"] is not None, t_overflow_s=ev["overflow"],
                     t_first_boil_s=ev["first_boil"], reached_boil=ev["reached_boil"], max_fill_frac=min(ev["max_fill"], 9.99), alarm_lead_s=lead,
                     note="MODEL ESTIMATE"))
    if sid in ("baseline", "wide", "lowflame", "detector", "detector_late", "hybrid"):
        ax.plot(t, fill * 100, lw=2.2 if sid == "hybrid" else 1.5, label=label)
ax.axhline(100, color=style.RED, ls="--"); ax.text(5, 103, "rim", color=style.RED)
ax.set_xlim(140, 260); ax.set_ylim(0, 125)
ax.set_xlabel("time since stove on (s)"); ax.set_ylabel("foam height as % of headroom")
ax.set_title("Which fixes keep foam below the rim? (model)"); ax.legend(frameon=False, fontsize=9, loc="upper left"); style.stamp(ax)
fig.tight_layout(); fig.savefig("figures/fig_scenarios_foam.png"); plt.close(fig)
df = pd.DataFrame(rows); df.to_csv("figures/model_scenarios.csv", index=False)
print(df[["scenario", "boil_over", "t_overflow_s", "t_first_boil_s", "alarm_lead_s"]].to_string(index=False))

# map 1: knob power x pot diameter (no fix) -> overflow?
Ps = np.arange(300, 2001, 100); Ds = np.arange(10, 26.1, 1)
Z = np.zeros((len(Ps), len(Ds)))
for i, p in enumerate(Ps):
    for j, d in enumerate(Ds):
        _, ev = simulate(Params(knob_power_w=float(p), pot_d_cm=float(d), t_max=1500))
        Z[i, j] = 1 if ev["overflow"] is not None else (0 if ev["reached_boil"] else 0.5)
fig, ax = plt.subplots(figsize=(7.5, 4.8))
ax.imshow(Z, origin="lower", aspect="auto", cmap="RdYlGn_r", extent=[Ds[0] - .5, Ds[-1] + .5, Ps[0] - 50, Ps[-1] + 50], vmin=0, vmax=1)
ax.set_xlabel("pot diameter (cm)"); ax.set_ylabel("burner power at the knob (W)")
ax.set_title("Boil-over (red) vs safe full boil (green), 500 mL, no fix — MODEL", fontsize=12); style.stamp(ax, color="white")
fig.tight_layout(); fig.savefig("figures/fig_map_power_diameter.png"); plt.close(fig)

# map 2: app cue temperature x human response time -> success?
cues = np.arange(70, 100.1, 1.5); resp = np.arange(0, 61, 4)
Z2 = np.zeros((len(resp), len(cues)))
for i, r in enumerate(resp):
    for j, c in enumerate(cues):
        _, ev = simulate(Params(detector=True, detector_trigger_c=float(c), human_response_s=float(r)))
        Z2[i, j] = 1 if ev["overflow"] is not None else 0
fig, ax = plt.subplots(figsize=(7.5, 4.8))
ax.imshow(Z2, origin="lower", aspect="auto", cmap="RdYlGn_r", extent=[cues[0] - .75, cues[-1] + .75, resp[0] - 2, resp[-1] + 2], vmin=0, vmax=1)
ax.set_xlabel("temperature at which the app cue fires (°C)"); ax.set_ylabel("human response time (s)")
ax.set_title("Latency budget: an earlier cue buys response time — MODEL", fontsize=12); style.stamp(ax, color="white")
fig.tight_layout(); fig.savefig("figures/fig_map_cue_response.png"); plt.close(fig)
print("figures written")
