# Ubaal detection algorithm (implemented in `app/core.js`; the same code runs in the browser and in Node)

## Physics → features
| Physical cue | Why it happens | Feature | Source |
|---|---|---|---|
| **Subcooled "singing"** rises, then **fades** just before the boil | Bubbles nucleate at the hot base and collapse in cooler bulk liquid, giving broadband noise ~100 Hz–1 kHz. It is loudest mid-heat-up and weakens as the bulk nears saturation and bubbles stop collapsing. | `sub` = mean power 150–1000 Hz (dB), slow EMA 5 s | [R31] kettle: peak at 60–70 °C, > 10 dB(A) drop by ~95 °C; [R32][R33] |
| **Deep bubbling** at the boil | Bubbles survive to the surface; larger, lower-pitched events | `low` = 40–150 Hz; `tilt` = low − sub | [R33] spectral pattern changes with regime |
| **Disc rattle** (if a disc is used) | Steam pulses lift the disc; periodic clicks | onset rate of positive spectral flux in 2–6 kHz | [R18][R19] |

Milk-specific caveat: the published acoustic data are for **water** in kettles and reactors. Milk's higher viscosity, proteins and skin may damp or shift the spectrum. **This is assumption A6 and is what our trials test.**

## Pipeline (10 frames/s)
1. Spectrum: AnalyserNode (fftSize 4096 at 44.1/48 kHz → ~11 Hz bins, Hann, `getFloatFrequencyData`) in the browser; radix-2 FFT in Node.
2. Band powers → dB. EMAs (fast 1 s, slow 5 s).
3. **Calibrate** for 8 s: the median gives the noise floor per band.
4. **Arm** when sub > floor + `armDb` (6 dB). Track the running peak of the slow EMA and the tilt at that peak.
5. **PRE_BOIL** when peak − sub_slow ≥ `dropDb` (4 dB) and the peak is ≥ `minPeakHoldS` (5 s) old.
6. **BOILING** when (low ≥ floor + 6 dB **and** tilt − tilt_at_peak ≥ 6 dB) **or** disc onset rate ≥ 1.5/s for ≥ 1.5 s.
7. Onset = flux > mean + 2.5·sd over a rolling 10 s window **and** flux > 1 dB.

## Tuning procedure (after recordings exist)
1. Record ≥ 3 labelled baseline trials (the app's label buttons).
2. `node tools/replay.mjs Tn.wav` → plot `features.csv` with the label times (`04_ANALYSIS/detector_eval.py`).
3. Choose `dropDb` and `minPeakHoldS` to **maximise lead time subject to zero false alarms** on the noise-only recording. Save as `cfg.json`. Document the change as the **refinement** (v1 → v2).
4. Freeze the config **before** the 10 evaluation trials (no tuning on test data, and say so on slide 5).

## Failure modes and mitigations
| Failure | Mitigation |
|---|---|
| Exhaust fan / mixer masks the hiss | Calibrate with the fan on; spectral subtraction of the floor |
| Induction coil whine (often > 15 kHz, or audible at some power levels) | Bands sit below 6 kHz. Check in a trial and note it |
| Milk does not "sing" like water (A6 false) | Fall back to BOILING + disc rattle (refinement H), or the timer rule B |
| Phone too far / steam on the mic | 30–60 cm, to the side, on a stand |
| Cold start: a second heating of the same milk | Recalibrate each trial |
