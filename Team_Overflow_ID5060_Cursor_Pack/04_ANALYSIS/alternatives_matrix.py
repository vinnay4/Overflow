"""
alternatives_matrix.py — weighted scoring of >=3 alternatives against target + constraints, with
weight-sensitivity check (does the winner survive +/-50 % changes to any single weight?).
Scores are TEAM JUDGEMENTS (1-5) backed by the evidence column; revise them after real trials.
"""
import os
import numpy as np, pandas as pd
import matplotlib.pyplot as plt
import style

style.apply(); os.makedirs("figures", exist_ok=True)
here = os.path.dirname(os.path.abspath(__file__))
M = pd.read_csv(os.path.join(here, "..", "01_RESEARCH", "alternatives_matrix.csv"))
W = pd.read_csv(os.path.join(here, "..", "01_RESEARCH", "alternatives_weights.csv"))
crit = list(W.criterion); w = W.weight.to_numpy(float); w = w / w.sum()
S = M[crit].to_numpy(float)
M["score_pct"] = (S @ w) / 5 * 100
M = M.sort_values("score_pct", ascending=False)
print(M[["id", "alternative", "transformer", "score_pct"]].to_string(index=False, float_format="%.1f"))

wins = {}
for i in range(len(w)):
    for f in (0.5, 1.5):
        ww = w.copy(); ww[i] *= f; ww /= ww.sum()
        best = M.iloc[np.argmax(M[crit].to_numpy(float) @ ww)]["id"]
        wins[best] = wins.get(best, 0) + 1
print("\nWinner under 16 single-weight perturbations (+/-50%):", wins)
M.to_csv("figures/alternatives_scored.csv", index=False)

fig, ax = plt.subplots(figsize=(8, 4.6))
colors = [style.ACCENT if i == "F" else ("#f59e0b" if i == "H" else "#9ca3af") for i in M.id]
ax.barh(M.alternative[::-1], M.score_pct[::-1], color=colors[::-1])
ax.set_xlabel("weighted score (% of maximum)"); ax.set_xlim(0, 100)
ax.set_title("Alternatives vs target and constraints (team-judged scores)")
for y, v in enumerate(M.score_pct[::-1]): ax.text(v + 1, y, f"{v:.0f}", va="center", fontsize=10)
style.stamp(ax, "scores = team judgement, revise after trials")
fig.tight_layout(); fig.savefig("figures/fig_alternatives_scores.png"); plt.close(fig)
