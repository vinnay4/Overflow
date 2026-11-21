# Evidence appendix: Team Overflow · ID5060 · "Milk boils over" (≤ 4 pages, A4, 10–11 pt)
*It supports the six slides and is not a second presentation. Every number is tagged **[MEASURED]**, **[SOURCE]** or **[MODEL]**. Replace every `__`.*

---
## Page 1 · Raw observations and baseline
**A1. Setup.** Pot: steel, D = __ cm, H = __ cm, mass __ g. Stove: __ (burner __, knob full). Milk: __ brand, __ type, __ % fat, 250 mL from the fridge (__ °C). Room __ °C. Video 30 fps, side-on, ruler inside the pot. Date(s): __ Nov 2026.
[photo: setup S5]

**A2. Field observations (as recorded) [MEASURED]**
| # | Observation | Evidence |
|---|---|---|
| O1 | Water at a full boil did not overflow; milk did, __ s after the first bubble | video T__ / T__ |
| O2 | A skin was visible from ~__ s (≈ __ °C if a thermometer was used) | frame S3 |
| O3 | Foam rose from __ cm to the rim in __ s | foam_height.csv |
| O4 | The kettle-like hiss was audible from ~__ s and faded ~__ s before the first bubble (or: not audible in milk) | Ubaal features.csv |
| O5 | Spill __ mL, cleanup __ min; flame went out? yes/no | trial log |
(Full list O1–O8 in the project repo, `04_OBSERVATIONS_ASSUMPTIONS_PRINCIPLES.md`.)

**A3. Baseline trials (no aid) [MEASURED]**: n = __
| Trial | Stove on → first bubble (s) | First bubble → overflow (s) | Max foam (cm) | Spill (mL) |
|---|---|---|---|---|
| B1 | | | | |
| B2 | | | | |
| B3 | | | | |
| mean (range) | | | | |
[figure: foam height vs time, baseline]

**A4. Assumptions we checked** (A1–A9 table with status: confirmed / refuted / untested).

---
## Page 2 · Calculations [SOURCE → MODEL]
**C1. Magnify.** V_steam/V_water = 958/0.598 = 1602 [R39]. Net power = 1740 W × 0.68 = 1183 W [R36]. Water boiled = 1183/2.257×10⁶ = 0.52 g/s. Steam = 0.88 L/s. Headspace (D 14, H 10, 500 mL) = 1.04 L → 1.2 s to fill if no bubble bursts. *(Recompute with our pot: __.)*
**C2. Buckingham π.** Variables H_e [L], Σ [T], Q_v [L³/T], A [L²], h_head [L]; k = 5, r = 2 → 3 groups: π₁ = H_e/h_head, π₂ = ΣQ_v/(A·h_head) = Π, π₃ = A/h_head². With Bikerman H_e = ΣU_g [R15], π₁ = π₂, so overflow ⇔ Π > 1.
**C3. Scale.** Π for D = 12…24 cm at full and low flame (table) [MODEL, Σ = 4.6 s assumed → fitted Σ = __ s].
**C4. Approach a Limit.** H(t) = H_e(1 − e^(−t/τ)) → t\* = −τ ln(1 − 1/Π). Table for Π = 1.01 … 8.
**C5. Σ fit [MEASURED → MODEL].** Foam decay after heat-off: τ = __ s (R² = __), Σ = τ/ε = __ s (ε = 0.85 assumed). [small plot]
**C6. Latency budget.** lead needed > response (__ s measured) + burner lag (~8 s gas, assumed) + margin. Model: cue at 88 °C → lead 24 s; cue at 95 °C → 8 s (fails).
**C7. Model calibration.** hLoss tuned so the model time-to-boil (__ s) matches the measured mean (__ s).
**C8. Model limitations.** 0-D; Σ constant per skin state; g(T) is a smooth stand-in; disc effect assumed.

---
## Page 3 · Trial data: Ubaal v1, v2 [MEASURED]
| Trial | Cond. | PRE-BOIL (s) | Knob down (s) | First bubble (s) | Lead (s) | Overflow? | Full boil held (s) | Taste | Notes |
|---|---|---|---|---|---|---|---|---|---|
| U1 | v1 | | | | | | | | |
| … | | | | | | | | | |
| U10 | | | | | | | | | |
**Summary:** boil-overs baseline __/__ vs v1 __/__ vs v2 __/__ (Fisher exact p = __). Lead time median __ s (range __–__). Misses __. False alarms __ (in __ min of noise-only recording).
**Refinement record.** v1 problem: __. Change: __ (decided on v1 data only; config frozen before v2). v2 result: __.
**User feedback** (n = __): "__", "__". Human response time: __ ± __ s (n = __).
**Detector config used:** `{dropDb: __, minPeakHoldS: __, …}` (git commit __).
[figure: per-trial timeline]

---
## Page 4 · References, AI use, contributions
**References** (the key ones; full list R1–R40 with URLs in the repo): Muir 2020 (New Scientist); America's Test Kitchen; Singh 2007, Lait 87:413; Dannenberg & Kessler 1988, J Food Sci 53:258; Kamath et al. 2008, Int Dairy J 18:994; Kamath, Webb & Deeth 2011, J Dairy Sci; Minim et al. 2002, J Chem Eng Data 47:1488; Pugh 2016, *Bubble and Foam Chemistry* ch. 11; Denkov 2004, Langmuir 20:9463; Kreiner 2015, Univ. Ulm; Collections WA (milk watcher, 1938); Ondrejčák & Lumnitzer 2014, Annals FEH (kettle acoustics); Panasonic US 9,462,639 / 9,386,635; MK News 12 Mar 2026; BIS IS 4246:2002; Engineering ToolBox steam tables; MDN AnalyserNode.
**AI use:** see `AI_USE_DECLARATION.md` (paste the short version here).
**Contributions:** see `CONTRIBUTIONS.md` (paste the table here).
**Data and code:** link to the repo / Drive folder with raw videos, CSVs, the app and the simulator.
