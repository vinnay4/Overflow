# Slide-by-slide content (the source of truth for the deck; matches deck/index.html)

Story in one line: **the failure is the sensor, not the milk. Change the frame and let the pot tell you, before Π crosses 1.**
D.A.R.E. mapping: S2 = Deconstruct, S3 = Analyze, S4 = Reconstruct, S5–S6 = Evaluate.

---
## Slide 1 · Problem, need, baseline, target (rubric: product, photo/diagram, user need, baseline, target; names + roll numbers)
**Headline:** Milk boils over. We made the pot tell you first.
- Lede: Milk sits calm for three minutes, then climbs over the rim in seconds. Every common fix needs someone standing at the stove.
- User need: get 250–500 mL packaged milk to a full boil on gas or induction at home **without watching the pot**.
- **Baseline:** kitchen n = 0 (UNTESTED). Model, 14 cm pot: first boil → overflow ≈ 2.2 s (MODEL). Do not tag the model number as measured.
- **Target:** 0/10 boil-overs in 10 unattended trials. Must stay acceptable: full boil, no taste change, easy to clean, < ₹300.
- Photo: OUR boil-over frame (pot, ruler, foam over the rim).
- Team box: names + roll numbers; "AI use declared in appendix".
**Notes:** see `<aside>` in the HTML (≈ 30 s).

## Slide 2 · Deconstruct (rubric: deconstruction, field evidence, evolution, assumptions questioned)
**Headline:** The failure was never the milk. It was the sensor: a person staring at the pot.
- System map (energy chain + information loop). `01_RESEARCH/08_DECONSTRUCTION_SYSTEM_MAP.md`
- Field evidence: 3 baseline frames with timestamps; foam height vs time (our video).
- Evolution timeline: watch/spoon → 1938 disc → milk boiler → 2011 capacitive patents → 2026 sound/vibration AI hobs.
- Five Whys → root cause: *no early, non-visual signal reaches the user*. `03_FIVE_WHYS.md`
- Assumptions questioned table (4 rows). `04_OBSERVATIONS_ASSUMPTIONS_PRINCIPLES.md`
**Notes:** ≈ 45 s.

## Slide 3 · Analyze (rubric: governing principles, ≥ 2 transformers, insights)
**Headline:** One number decides boil-over. Four transformers showed us how to move it.
- 5 principles with sources (phase change ×1600; energy conservation; surface films / Gibbs–Marangoni; whey > 70–75 °C; Bikerman H = ΣU_g).
- **Π = Σ·Q_v/V_free** (Buckingham: 5 variables, 2 dimensions → 3 groups). Π > 1 ⇒ boil-over. Π ≈ 3.9 at full flame, 14 cm pot (MODEL).
- 4 transformer cards, each with **operation · insight · how it changed the rebuild**: Magnify, Scale, Approach a Limit, Change Frame. `05_TRANSFORMER_WORKSHEETS.md`
**Notes:** ≈ 60 s. Say "MODEL" aloud for every Π number.

## Slide 4 · Reconstruct (rubric: ≥ 3 alternatives, comparison, selected solution, annotated sketch/workflow)
**Headline:** Nine ways to move Π. We chose the one that needs no new hardware.
- Table of 9 alternatives with Π term, transformer and weighted score (F 85 … D 64) + weights + sensitivity (F wins 15/16).
- Ubaal 5-step workflow (Start → Hiss rises → PRE-BOIL alarm → Turn down → Full boil).
- Annotated sketch (`sketch_ubaal.svg`, or a hand drawing) + latency-budget map (`fig_map_cue_response.png`).
- "Why it should work" line (mechanism).
**Notes:** ≈ 45 s.

## Slide 5 · Evaluate: build, test, refine (rubric: what was built, test method, before/after evidence, refinement)
**Headline:** We built it, tested it against the baseline, then changed it once.
- Built: Ubaal app (screenshot) + simulator (screenshot).
- Method: same pot, burner, milk and volume; definition of **unattended**; n per arm; video ground truth.
- **Before/after:** `fig_trials_boilovers.png` + `fig_trials_timeline.png` (REAL data only).
- Refinement v1 → v2: what we observed, what we changed, the result. (Or evidence for keeping v1.)
**Notes:** ≈ 45 s. Say n. If a trial failed, show it.

## Slide 6 · Evaluate: benefits, cost, trade-offs, limits, next, references
**Headline:** What changed, what it cost, and what we still don't know.
- KPI tiles: boil-overs n = 0, target still 0/10 (UNTESTED); warning lead 24 s at an 88 °C cue (MODEL); cost ₹0 (+ ₹295 optional disc).
- Trade-offs: slower boil after turn-down (MODEL +~26 s); phone placement; a human still turns the knob on gas; false alarms.
- Limitations: few trials, one kitchen; Π and Σ are estimates; synthetic tests prove logic, not physics.
- Next step: close the loop on induction (relay/hob API) + an on-device classifier.
- Key references (9 lines).
**Notes:** ≈ 30 s.

---
### If an examiner asks… (prep)
- *"Isn't this just a timer?"* No. A timer doesn't know your burner, pot, volume or start temperature. The acoustic cue comes from the milk's own thermal state. We compared it with the timer rule (B) in the matrix.
- *"Did the sound cue work on milk?"* Answer with our measured lead times and misses. If it failed, say so and show the v2 change.
- *"Why is Σ = 4.6 s?"* It is assumed in the model, then fitted from our foam-decay video (`foam_fit.py`). State the fitted value.
- *"Why not just use a big pot?"* Scale: you need about 24 cm at full flame for 500 mL (MODEL). ATK says a 4-quart pan for a pint. It is a weak lever.
