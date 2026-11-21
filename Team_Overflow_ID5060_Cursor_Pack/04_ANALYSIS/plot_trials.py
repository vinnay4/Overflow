"""
plot_trials.py — before/after evidence from the REAL trial CSV.

  python plot_trials.py data/trials.csv            # real data (what goes in the deck)
  python plot_trials.py --example                  # pipeline check with EXAMPLE_SYNTHETIC data (watermarked)

Outputs figures/fig_trials_boilovers.png, figures/fig_trials_timeline.png, figures/trials_summary.csv
Stats: Fisher's exact test (one-sided) for boil-over counts, implemented without scipy.
"""
import sys, os, math
import pandas as pd, numpy as np
import matplotlib.pyplot as plt
import style

style.apply(); os.makedirs("figures", exist_ok=True)
example = "--example" in sys.argv
path = "data/EXAMPLE_SYNTHETIC_trials.csv" if example else (sys.argv[1] if len(sys.argv) > 1 else "data/trials.csv")
if not os.path.exists(path):
    sys.exit(f"{path} not found. Copy data/trials_template.csv to data/trials.csv and enter your real trials, or run with --example.")
df = pd.read_csv(path, comment="#")
if not example and "is_example" in df.columns and df["is_example"].fillna(0).astype(int).any():
    sys.exit("Refusing: this file contains EXAMPLE rows. Real-data plots must use real rows only.")
WM = "EXAMPLE SYNTHETIC DATA — NOT MEASURED" if example else f"measured, n = {len(df)} trials"
PFX = "EXAMPLE_" if example else ""

def fisher_one_sided(a, b, c, d):
    """P(X <= a) for table [[a,b],[c,d]]: a = boil-overs in treatment, c = boil-overs in baseline."""
    n1, n2, k = a + b, c + d, a + c
    def hyp(x): return math.comb(n1, x) * math.comb(n2, k - x) / math.comb(n1 + n2, k)
    return sum(hyp(x) for x in range(max(0, k - n2), a + 1))

g = df.groupby("condition").agg(n=("trial_id", "count"), boil_overs=("boil_over", "sum"),
                                full_boil=("full_boil_reached", "sum")).reset_index()
base = g[g.condition == "baseline"]
rows = []
for _, r in g.iterrows():
    p = None
    if r.condition != "baseline" and len(base):
        b = base.iloc[0]
        p = fisher_one_sided(int(r.boil_overs), int(r.n - r.boil_overs), int(b.boil_overs), int(b.n - b.boil_overs))
    rows.append({**r.to_dict(), "boil_over_rate": r.boil_overs / r.n, "fisher_p_vs_baseline": p})
summ = pd.DataFrame(rows)
if "t_first_bubble_s" in df and "t_app_pre_boil_s" in df:
    df["lead_s"] = df["t_first_bubble_s"] - df["t_app_pre_boil_s"]
    summ = summ.merge(df.groupby("condition")["lead_s"].agg(["mean", "min", "max"]).add_prefix("lead_").reset_index(), on="condition", how="left")
if "t_overflow_s" in df:
    df["bubble_to_overflow_s"] = df["t_overflow_s"] - df["t_first_bubble_s"]
    summ = summ.merge(df.groupby("condition")["bubble_to_overflow_s"].agg(["mean", "min", "max"]).add_prefix("b2o_").reset_index(), on="condition", how="left")
summ["data"] = WM
summ.to_csv(f"figures/{PFX}trials_summary.csv", index=False)
print(summ.to_string(index=False))

order = [c for c in ["baseline", "disc", "app_v1", "app_v2", "app_disc"] if c in set(g.condition)] + [c for c in g.condition if c not in ["baseline", "disc", "app_v1", "app_v2", "app_disc"]]
gg = g.set_index("condition").loc[order]
fig, ax = plt.subplots(figsize=(7, 4.2))
cols = [style.RED if c == "baseline" else style.GREEN for c in order]
ax.bar(order, gg.boil_overs, color=cols)
for i, (bo, n) in enumerate(zip(gg.boil_overs, gg.n)): ax.text(i, bo + 0.1, f"{int(bo)}/{int(n)}", ha="center", fontsize=12, fontweight="bold")
ax.set_ylabel("boil-overs (count)"); ax.set_ylim(0, max(gg.n) + 1)
ax.set_title("Primary outcome: boil-overs in unattended trials"); style.stamp(ax, WM, style.RED if example else style.MUTED)
fig.tight_layout(); fig.savefig(f"figures/{PFX}fig_trials_boilovers.png"); plt.close(fig)

fig, ax = plt.subplots(figsize=(8, 4.6))
for i, (_, r) in enumerate(df.iterrows()):
    y = i
    ax.plot([0, r.t_first_bubble_s], [y, y], color="#d6d3d1", lw=3)
    if pd.notna(r.get("t_app_pre_boil_s")): ax.plot(r.t_app_pre_boil_s, y, "o", color=style.ACCENT)
    if pd.notna(r.get("t_knob_down_s")): ax.plot(r.t_knob_down_s, y, "s", color=style.BLUE)
    ax.plot(r.t_first_bubble_s, y, "|", color=style.INK, ms=14)
    if pd.notna(r.get("t_overflow_s")): ax.plot(r.t_overflow_s, y, "X", color=style.RED, ms=10)
ax.set_yticks(range(len(df))); ax.set_yticklabels(df.trial_id, fontsize=8)
ax.set_xlabel("seconds since stove on"); ax.set_title("Each trial: alarm (●), knob down (■), first bubble (|), overflow (✕)")
style.stamp(ax, WM, style.RED if example else style.MUTED)
fig.tight_layout(); fig.savefig(f"figures/{PFX}fig_trials_timeline.png"); plt.close(fig)
print("figures written")
