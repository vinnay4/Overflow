# Ubaal test plan (software → bench → kitchen). Link to `09_HOME_TRIAL_KIT/TRIAL_PROTOCOL.md`

| Level | Test | Pass criterion | Status |
|---|---|---|---|
| L0 unit | `npm test`: synthetic hiss → fade → bubbling | PRE_BOIL < BOILING; no alarm on noise | ✅ 3/3 (21 Nov 2026, IST) |
| L0 replay | `tools/replay.mjs` on a synthetic WAV | same events as the live engine | ✅ |
| L1 phone | Open on Android Chrome over https; calibrate; spectrum moves when you speak | UI works; wake lock holds 5 min | ☐ TO DO |
| L2 noise | 2 min kitchen noise (fan, talking, utensils) with no stove | 0 alarms | ☐ TO DO |
| L3 water | Heat 500 mL **water** (cheap, safe) ×2, labelled | PRE_BOIL fires before boiling; lead time recorded | ☐ TO DO |
| L4 milk, attended | 3 baseline milk trials, phone recording, a person ready at the knob | the sound shows the hiss → fade pattern? record lead / miss | ☐ TO DO |
| L5 evaluation | Frozen config. Up to 10 "unattended" milk trials (a person out of sight of the pot, acting only on the alarm; a safety observer present but not intervening unless foam reaches 1 cm from the rim) | **Primary: boil-overs / 10 (target 0)**. Secondary: lead time, full boil reached, false alarms | ☐ TO DO |

**Metrics** (computed by `04_ANALYSIS/detector_eval.py`): lead = t_first_bubble (label) − t_PRE_BOIL; miss = no PRE_BOIL before overflow/boil; false alarm = PRE_BOIL more than 120 s before first bubble or with no stove on; success = no boil-over **and** full boil held ≥ 10 s.

**Statistics (honest with n ≤ 10):** report counts (e.g. "0/8 vs 4/4 boil-overs"), Fisher's exact p (`plot_trials.py`), and median and range of lead time. Do not report % improvements on tiny samples without the counts.

**Safety:** a safety observer is always in the room with a view of the pot, but does not act unless foam is within 1 cm of the rim (count that as a boil-over **prevented by the observer = failure**). Use 250 mL for the first milk trials. Keep the gas FFD in mind [R38].
