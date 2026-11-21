# Ubaal: product spec

**User:** anyone heating 250–500 mL milk at home who wants to walk away (Team Overflow scope).
**Job:** "Tell me early enough to turn the flame to sim before the milk boils over."
**Constraint fit:** ₹0 (uses the phone they own); no change to milk (taste); nothing in the pot (cleaning); works on gas and induction (sound is stove-agnostic).

## States
`READY → CALIBRATING (8 s) → LISTENING → PRE_BOIL (alert) → BOILING (urgent alert) → STOPPED`

## Screens (single page, already built)
- Setup row: stove type, disc checkbox, spoken alert, trial ID.
- Big status ring (colour = state) + elapsed clock + message line.
- Start / Stop & save.
- Ground-truth label buttons (for experiments).
- Live spectrum (log-f) + band-level chart (sub-band, low band, tilt) for the demo video.
- Event log.

## Alerts
Web Audio beep (3 × 1046 Hz; urgent 5×), `navigator.vibrate`, `speechSynthesis` (English; add a Hindi string `"दूध उबलने वाला है, आँच धीमी करें"` as a toggle if time allows), and a Notification if permitted. Screen wake lock while listening.

## Data export (on Stop)
`<id>_features.csv` (t, sub, low, flux, tilt, emaSubS, emaLow, onsetRate, state, 10 Hz), `<id>_events.csv`, `<id>_labels.csv`, `<id>_audio.webm`. A metadata header gives stove, disc, UA and start time.

## Non-goals (v1)
Automatic flame control (needs hardware, = alternative G). Multi-pot kitchens. Pressure cooker whistles (treat them as noise; log false alarms).

## Acceptance criteria for the demo
- Starts on Android Chrome over https. Calibrates. Shows the live spectrum.
- In ≥ 1 real trial, PRE_BOIL fires before first bubble/foam with lead ≥ (response + burner lag), **or** we report honestly that it did not and show the refinement.
- No alarm during 2 min of normal kitchen noise (fan, talking): the false-alarm check.

---
# Optional: camera mode (a second sensor). Build only if the audio cue fails on milk

**Why it is optional:** the Magnify transformer says visible foam gives ~1 s of warning at full flame. So the camera is a **backup / ground-truth logger**, not the primary cue. It is useful for: (a) automatic foam-height-vs-time data for the baseline (deck requirement), and (b) a "BOILING" confirmation.

## Spec
- `getUserMedia({video:{facingMode:"environment"}})`. The phone is side-on to the pot, rim in frame, with a ruler taped vertically on the pot (scale).
- The user draws two horizontal lines once: **milk surface** and **rim**.
- Per frame (5 fps): in a vertical strip at the pot centre, find the topmost row where brightness > (milk mean − k·sd). Milk and foam are white. Foam height = that row relative to the surface line, converted to cm using the ruler.
- Alarm if the foam rises > 30 % of headroom in < 2 s (the rate cue), or reaches 70 % of headroom.
- Export `foam_height.csv` (t, h_cm), which matches `04_ANALYSIS/data/foam_height_template.csv`.
- Fallback with no code: record a side-on video, then scrub frame by frame and type the heights into the template. This is fine for the appendix.

## Acceptance
On one recorded baseline video, the auto heights are within ±0.5 cm of manual scrubbing at 5 sampled times.
