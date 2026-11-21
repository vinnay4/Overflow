# Home trial protocol: one evening, one kitchen, ~₹200–400 of milk (the only "physical" work left)

**Why this matters:** the rubric says observations must be real and evaluation must compare against the baseline. Software can't replace this, but it can make it fast. Everything below needs only: 1 steel pot, 1 stove, packaged milk, 2 phones, a ruler/steel scale, tape, a kitchen thermometer (optional), and a notebook.

**People:** Tester (operates, is "the user"), Recorder (video + labels), Safety observer (can be the Recorder; intervenes only if foam is within 1 cm of the rim). It can be done by 2 people.

**Budget:** each trial uses 250 mL (half packet). 10–14 trials ≈ 3–3.5 L ≈ 6–7 packets of toned milk. Reuse the boiled milk (tea, curd), so nothing is wasted.

## 0 · Setup (15 min, once)
1. Measure and record the pot: inner diameter D, height H, mass (kitchen scale if available). Photo of the pot with the ruler.
2. Tape a steel ruler **inside** the pot, vertical, zero at the base (or outside, with marks visible). Mark the 250 mL level.
3. Phone A = video, side-on at rim height, 1 m away, 30 fps, ruler readable. Phone B = Ubaal, on a stand 30–60 cm from the pot, out of the steam.
4. Same burner, same knob position ("full") for every trial. Note burner size (big/medium) and stove type.
5. Milk straight from the fridge (note the temperature if you have a thermometer). Same brand and type throughout.
6. Open `09_HOME_TRIAL_KIT/TRIAL_PROTOCOL.md` (or the `trials_template.csv` on a laptop).

## 1 · Human response time (10 min, no stove) → `human_response_template.csv`
The Tester sits where they would be "unattended" (next room, phone in hand, doing something else). The Recorder plays the Ubaal alarm (press Start, then trigger with a loud hiss-then-silence, or simply say "now" and start a stopwatch). Time to **hand on the knob**. 5 attempts per person. This replaces the model's assumed 15 s.

## 2 · Baseline: no aid (3–5 trials) → `trials.csv` with condition = baseline
For each trial: 250 mL in the pot → start video → say the trial ID into the camera → Ubaal **recording only** (it may alarm; the Tester ignores it in baseline, so this gives us labelled audio) → stove ON at full → nobody touches anything → Recorder taps labels: Stove on · First bubble · Foam rising · Overflow! → safety observer turns OFF at overflow (or at 1 cm from the rim; count it as a boil-over) → measure spill (tilt the stove plate into a measuring cup, or estimate) → clean, cool the pot under the tap to room temperature, dry it.
Record: t_first_bubble, t_overflow, max foam height, spill, cleanup minutes.
**This is the baseline the deck asks for:** first bubble → overflow (s), and foam height over time.

## 3 · Ubaal v1 trials (target 10, minimum 5) → condition = ubaal_v1
**Freeze the app config first** (do not tune during these trials). Same setup. The Tester starts Ubaal, lights the stove at full, then **leaves the kitchen** (unattended). They return **only** when the alarm sounds, and turn the knob to sim. Then let it reach a full boil (rolling bubbles across the surface) and hold 10 s → off.
Record: t_app_pre_boil, t_knob_down, t_first_bubble, overflow yes/no, max foam, full boil reached, taste (0 same / 1 slight / 2 different; taste vs a control cup), cleanup.

## 4 · Foam decay for Σ (2 trials, can be the last baseline trials) → `foam_decay_template.csv`
When foam is high but **before** the rim, the safety observer cuts the heat (gas off). On the video, read the foam height every 1 s for 15–20 s. `python foam_fit.py` gives τ and Σ = τ/ε. Put Σ in the model (`milk_model.py` + `model.ts`) so the simulator becomes **calibrated**. That is a strong slide-3 line.

## 5 · Refinement v2 (2–5 trials) → condition = ubaal_v2
Pick ONE change based on what v1 showed, and write down why before testing:
- lead time too short → lower `dropDb` 4 → 3 or `minPeakHoldS` 5 → 3 (re-tune on the v1 recordings using `tools/replay.mjs`, never on v2 data);
- missed alarms (milk doesn't "sing" like water) → add the disc (₹295) and rely on the rattle cue, or use the BOILING cue + a lower knob;
- false alarms → calibrate with the exhaust fan on;
- v1 was already 0 boil-overs → keep v1, and use the v2 slot to test the hardest case (big burner, or 500 mL) to show robustness. The rubric allows "explain with evidence why the first version should be retained".

## 6 · Optional cheap extras (only if time allows)
- 2 trials with **water** (no foam) to show the acoustic pattern without milk: a nice control.
- 1 trial with 500 mL to check the upper end of the scope.
- Ask 3 flatmates/family to use Ubaal once and give 1-line feedback (rubric: "obtain relevant user feedback").

## After the session (30 min)
Copy app exports to `04_ANALYSIS/data/raw/<trial_id>/`. Fill `data/trials.csv`. Run `bash make_all.sh`, `python plot_trials.py data/trials.csv` and `python detector_eval.py`. Paste the numbers into the deck TO FILL boxes and the appendix. Pick photos using `09_HOME_TRIAL_KIT/TRIAL_PROTOCOL.md`.

**Safety:** never leave the stove truly unattended. The observer stays in the room, watching the pot but not "helping". Keep a cloth ready. If the flame goes out from a spill, turn the gas OFF at the knob and the regulator, and ventilate before relighting [R38]. Don't let the pot boil dry. Hot milk burns: handle it with a holder.

---
# Shot list

| # | Shot | Use | Tips |
|---|---|---|---|
| S1 | Hero: foam spilling over the rim, ruler visible | Slide 1 | Side-on, rim at eye level, 60 fps if possible. Take a still from the video |
| S2 | Calm milk at ~2 min · first foam · over the rim (3 frames, same angle) | Slide 2 | Burn the timer into the frame (a stopwatch phone in view) |
| S3 | Skin close-up (spoon lifting the skin) | Slide 2 / appendix | Macro, good light |
| S4 | Spill on the stove + cleanup | Slide 2 (losses) | Shows waste, effort, flame-out risk |
| S5 | Setup overview: pot, ruler, phone A, phone B (Ubaal) | Slide 5 / appendix | Top-down + side |
| S6 | Ubaal screen during the hiss (spectrum visible) and at the PRE-BOIL alarm | Slide 5, video | Screen record on the phone (Android has a built-in recorder) |
| S7 | Tester in another room getting the alarm, walking in, turning the knob | Video | Shows "unattended" |
| S8 | Milk at a full rolling boil, foam below the rim, after turn-down | Slide 5/6, video | The "after" money shot |
| S9 | Foam-decay sequence (heat cut, foam falling) | Appendix (Σ fit) | Tripod, ruler sharp |
| S10 | Team at work (all 3), hand-drawn sketch, whiteboard of Π | Appendix contributions | Faces optional |
| S11 | Disc in the pot + rattle (only if bought) | Refinement | Audio matters |
| S12 | Water boiling, no foam (control) | Slide 2 contrast | Same pot |

---
# Printable data sheet

Pot: D ____ cm · H ____ cm · mass ____ g · Stove: gas / induction · Burner: big / med · Knob: full
Milk: brand ________ type ________ fat ___ % · Volume per trial: 250 mL · Fridge temp ___ °C · Room ___ °C
Date ________ · Tester ________ · Recorder ________ · Observer ________

| Trial | Cond. (base/v1/v2) | Stove on (clock) | First bubble (s) | Foam start (s) | App PRE-BOIL (s) | Knob down (s) | Overflow (s) / none | Max foam (cm) | Full boil? held (s) | Spill (mL) | Taste 0–2 | Cleanup (min) | Video file | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| T01 | | | | | | | | | | | | | | |
| T02 | | | | | | | | | | | | | | |
| T03 | | | | | | | | | | | | | | |
| T04 | | | | | | | | | | | | | | |
| T05 | | | | | | | | | | | | | | |
| T06 | | | | | | | | | | | | | | |
| T07 | | | | | | | | | | | | | | |
| T08 | | | | | | | | | | | | | | |
| T09 | | | | | | | | | | | | | | |
| T10 | | | | | | | | | | | | | | |
| T11 | | | | | | | | | | | | | | |
| T12 | | | | | | | | | | | | | | |
| T13 | | | | | | | | | | | | | | |
| T14 | | | | | | | | | | | | | | |
| T15 | | | | | | | | | | | | | | |

Human response (s): Person A ___ ___ ___ ___ ___ · Person B ___ ___ ___ ___ ___
Foam decay (cm every 1 s after heat off), trial ___: ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___
