"""
detector_eval.py — score Ubaal against ground truth labels from real trials.

Expects, per trial folder data/raw/<trial_id>/ :  <id>_events.csv  and  <id>_labels.csv  (saved by the app),
or a *_replay_events.csv produced by 03_DETECTOR_APP/tools/replay.mjs.
Metrics per trial:
  lead_s     = t(first_bubble label) - t(PRE_BOIL event)     (positive = warned before the boil)
  boil_lag_s = t(BOILING event) - t(first_bubble label)
  miss       = no PRE_BOIL or BOILING before overflow/first bubble + 10 s
  false_alarm= PRE_BOIL more than 120 s before first bubble (TO TUNE)
"""
import os, glob, sys
import pandas as pd

root = sys.argv[1] if len(sys.argv) > 1 else "data/raw"
rows = []
for d in sorted(glob.glob(os.path.join(root, "*"))):
    if not os.path.isdir(d): continue
    tid = os.path.basename(d)
    ev_f = (glob.glob(os.path.join(d, "*_events.csv")) + glob.glob(os.path.join(d, "*_replay_events.csv")))
    lb_f = glob.glob(os.path.join(d, "*_labels.csv"))
    if not ev_f or not lb_f: print(f"skip {tid}: need events + labels"); continue
    ev = pd.read_csv(ev_f[0], comment="#"); lb = pd.read_csv(lb_f[0], comment="#")
    fb = lb.loc[lb.label == "first_bubble", "t"].min()
    ov = lb.loc[lb.label == "overflow", "t"].min()
    pre = ev.loc[ev.type == "PRE_BOIL", "t"].min(); boil = ev.loc[ev.type == "BOILING", "t"].min()
    lead = fb - pre if pd.notna(pre) and pd.notna(fb) else None
    rows.append(dict(trial=tid, first_bubble=fb, overflow=ov, pre_boil=pre, boiling=boil, lead_s=lead,
                     boil_lag_s=(boil - fb) if pd.notna(boil) and pd.notna(fb) else None,
                     miss=bool(pd.isna(pre) and (pd.isna(boil) or boil > fb + 10)),
                     false_alarm=bool(lead is not None and lead > 120)))
if not rows: sys.exit("No scored trials yet. Record real trials with the app first (09_HOME_TRIAL_KIT).")
r = pd.DataFrame(rows); print(r.to_string(index=False)); r.to_csv("figures/detector_eval.csv", index=False)
print(f"\nmean lead = {r.lead_s.mean():.1f} s, misses = {r.miss.sum()}, false alarms = {r.false_alarm.sum()}")
