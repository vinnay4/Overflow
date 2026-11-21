# Project context (brief, team deck, course frameworks, rubric map, timeline)

---
<!-- was 00_CONTEXT/CONTEXT.md -->
# Project brief summary: ID5060 First Principles Thinking term project
Source: `source_pdfs/01_Project_Brief_and_Rubric.pdf` (3 pages). The text version is in `ALL_SOURCE_TEXT.md`.

- **Deadline:** 25 Nov 2026. **Weight:** 20 % of the course. The problem-statement stage (10 Oct) was 5 of 20 marks. **The final submission is 15 of 20.**
- **Task:** pick an everyday product, process, service or persistent problem. Investigate it, question its assumptions, find the governing first principles, rebuild it, **build or pilot** the change, and **evaluate it against the current approach**. Choose one primary outcome. Other outcomes must stay acceptable.
- **Show a traceable chain:** evidence → principles → design decision → test. Say what changed, why it should work, what actually happened, and what you'd improve.
- A **process/service may use a functional mock-up tested with users**. Choose a form that tests the *central mechanism*. (This is why a software build is legitimate here.)

## Six steps
1. **Problem + baseline:** who, where, which outcome. Record current performance (observation, measurement, user accounts). Measurable target. Constraints.
2. **Gather + deconstruct:** components, actions, flows, interactions; photos, exploded view, process map or system boundary. Where time, effort, material, information or energy is lost. **Five Whys** as a connected causal chain checked against evidence. Evolution over time and the constraints that shaped it. **Label unsupported history as hypotheses.**
3. **Separate** observations / assumptions-hypotheses / governing principles. Test claims about user behaviour locally.
4. **≥ 2 transformers.** For each: what was transformed, the maths operation, the insight, and how it changed the rebuild.
5. **≥ 3 meaningfully different alternatives**, compared on target, constraints and trade-offs. Choose one and explain its mechanism. **Annotated sketch or revised process map.**
6. **Build/pilot**, compare with the baseline under similar conditions, repeat, record variation, get user feedback. **≥ 1 refinement** (or evidence to keep v1). Limitations. **Distinguish measured from estimated.**

## Submission
- **≤ 6 main slides** + **≤ 4-page evidence appendix** + optional **≤ 2-min video**.
- Names and roll numbers on slide 1. Contributions in the appendix.
- Slide contents are fixed (see `00_CONTEXT/CONTEXT.md`).
- Appendix = raw observations, trial data, calculations, extra references, prototype photos, contributions. "Not a second presentation."
- Cite the source of each important claim. **Declare AI use** and verify what you keep. Observations must be real.
- "An honest unsuccessful trial can earn strong marks… A large claimed gain without supporting evidence will receive limited credit."

---
<!-- was 00_CONTEXT/CONTEXT.md -->
# What Team Overflow already submitted (problem statement, 10 Oct stage)
Source: `source_pdfs/02_Team_Overflow_Submitted_Problem_Deck.pdf`

**Team Overflow:** Vinay Chekuri EE22B026 (representative), Vinnay Gupta ED22B073, Atharva Chinchalkar BS22B010.

**Hook:** "Milk boils over. Every kitchen knows it." Milk sits calm, then rises over the rim in seconds. The usual fixes all depend on someone standing guard.

**Observations (as submitted)**
1. Water at a full boil does not overflow. Milk overflows within seconds of reaching a boil.
2. A skin forms on milk as it heats.
3. The skin traps rising steam bubbles, which build up as foam and push over the rim.
4. Common remedies (low flame, stirring, spoon across the pot) need the user at the stove.
5. A spill wastes milk, needs cleaning, and can put out the flame on a gas stove.

**Scope (as submitted; do not change it, the final must match)**
| | |
|---|---|
| Objective | Prevent boil-over without the user watching the vessel |
| Setting | 250–500 mL packaged milk, steel pot, gas or induction stove at home |
| Primary outcome | Boil-overs in 10 unattended trials. **Target: zero** |
| Constraints | Full boil; no taste change; easy to clean; cost < ₹300 |
| Baseline to record | Time from first bubble to overflow; foam height over time |
| Out of scope | Microwave, industrial processing, starchy liquids |

**Implication for the final:** the primary outcome needs **10 unattended trials with Ubaal**, plus a baseline. If the full 10 cannot be done, report the n actually done honestly and say so on slide 5 and slide 6. Observation 3 is refined in our analysis: the skin raises bubble lifetime Σ (casein/whey-stabilised films, and the skin lid), not literally "trapping".

---
<!-- was 00_CONTEXT/CONTEXT.md -->
# Course frameworks we must visibly use (decks 03–07)

| Framework | Course definition | Where we use it |
|---|---|---|
| **D.A.R.E.** | **Deconstruct** (challenge assumptions by repeatedly asking why), **Analyze** (identify fundamental truths/factors objectively, avoid opinions and tradition), **Reconstruct** (build from principles creatively), **Evaluate** (test & iterate) | Deck structure: slide 2 = D, slide 3 = A, slide 4 = R, slide 5–6 = E |
| **F.O.U.N.D.** | Fun experiment → Observe → Understand → Notice in applications → Discover use | Kitchen experiment (water vs milk boil) → observe foam → understand Σ → notice the disc and the 2026 AI hobs → discover use (Ubaal) |
| Pinhole-camera lesson | "What is the real need/function?" (butter paper → translucent surface) | **Function = "lower the heat before the boil"**, not "watch the pot" or "stop foam". So any sensor that gives early warning will do. |
| Seven habits | 1 FOUND, 2 product → principle, 3 phenomenon → products, 4 test and build intuition, 5 ask the right question / think factors (measures), 6 **ask what existed before**, 7 **Medici effect (intersections)** | 6 → `07_EVOLUTION_WHAT_EXISTED_BEFORE.md`; 7 → acoustics × dairy foam × phone sensors; 5 → our measure is "boil-overs per 10 unattended trials" and "lead time in s"; 4 → number sense (×1600, 1 s) |
| Transformers (deck 06) | Magnify (gears, levers, Y = b/X, exponential growth, Arrhenius, resonance), Scale, Approximate, Idealize, … Approach a Limit, Change Frame, Perturb | `01_RESEARCH/05_TRANSFORMER_WORKSHEETS.md` |
| Dimensional analysis (deck 07) | Dimensional homogeneity, Buckingham π (k − r groups), scaling laws (Gulliver, polar animals, surface/volume) | Π = ΣQ_v/V_free; Π ∝ 1/D² |
| "Ask the right question: what measure?" (deck 05) | The question is about the measure behind it | Change the measure from "foam height" to "seconds of warning before the boil" |

**Viva line:** "We asked the pinhole-camera question: what is the real function of the person staring at the pot? It is an early-warning sensor. So we replaced the sensor, not the milk."

---
<!-- was 00_CONTEXT/CONTEXT.md -->
# Rubric → where it is satisfied (check every row before submitting)

| Brief requirement | Where in our submission | Pack file(s) | Needs real data? |
|---|---|---|---|
| S1: product/problem, photo or diagram, user need, baseline, target, names + roll numbers | Slide 1 | deck, `00_CONTEXT/CONTEXT.md` | Baseline numbers + photo |
| Step 1: who, where, outcome; constraints | Slide 1 | same | – |
| S2: deconstruction (components, flows, losses) | Slide 2 system map | `08_DECONSTRUCTION_SYSTEM_MAP.md` | Losses (spill mL, cleanup min) |
| Field evidence | Slide 2 frames + foam curve | `09_HOME_TRIAL_KIT/TRIAL_PROTOCOL.md` | **Yes** |
| Five Whys, a connected chain checked against evidence | Slide 2 | `03_FIVE_WHYS.md` | – |
| Evolution + shaping constraints; history labelled as hypothesis where unsupported | Slide 2 timeline; appendix | `07_EVOLUTION_WHAT_EXISTED_BEFORE.md` | – |
| Step 3: observations vs assumptions vs principles | Slide 2 table + Slide 3 principles + appendix A4 | `04_OBSERVATIONS_ASSUMPTIONS_PRINCIPLES.md`, `02_FIRST_PRINCIPLES.md` | Observations O1–O8 must be confirmed |
| Test claims about user behaviour locally | Human response test; user feedback | `TRIAL_PROTOCOL.md` §1, §6 | **Yes** |
| S3 / Step 4: ≥ 2 transformers, each with what / maths / insight / changed rebuild | Slide 3 (4 cards) | `05_TRANSFORMER_WORKSHEETS.md`, simulator #transformers | – (model) |
| S4 / Step 5: ≥ 3 alternatives, comparison vs target and constraints, choice + mechanism, annotated sketch or map | Slide 4 | `06_ALTERNATIVES.md`, `alternatives_matrix.py`, `sketch_ubaal.svg` | – |
| S5 / Step 6: build/pilot, method, before/after under similar conditions, repeats, variation, user feedback, ≥ 1 refinement | Slide 5 | `03_DETECTOR_APP`, `TRIAL_PROTOCOL.md`, `plot_trials.py` | **Yes** |
| S6: measured benefits, cost, trade-offs, limitations, next step, key references; measured vs estimated | Slide 6 | `SLIDES_CONTENT.md` | **Yes** |
| ≤ 6 slides, ≤ 4-page appendix, ≤ 2-min video | deck / appendix / video | `05_DECK`, `06_APPENDIX`, `07_VIDEO` | – |
| Contributions in the appendix | Appendix p4 | `CONTRIBUTIONS.md` | Edit |
| Source for each important claim | Footers + appendix | `REFERENCES.md`, `references.bib` | – |
| AI use stated and claims verified | Appendix p4 | `AI_USE_DECLARATION.md` | Team must verify |
| Course frameworks visible (D.A.R.E., F.O.U.N.D., habits, π) | Kickers on every slide; S3 | `00_CONTEXT/CONTEXT.md` | – |

---
<!-- was 00_CONTEXT/CONTEXT.md -->
# 4-day plan (today Sat 21 Nov 2026 → submit Wed 25 Nov 2026). Placement-friendly: ~1.5–2 h per person per day

| Day | Vinay C (app) | Vinnay G (deck/analysis) | Atharva C (trials/science) | Done when |
|---|---|---|---|---|
| **Sat 21** | Deploy Ubaal to GitHub Pages; test on 2 phones (L1, L2) | Read the pack; run Cursor prompts P0–P2; review the slide text | Buy milk; prep pot + ruler; measure the pot | App URL works on a phone |
| **Sun 22 (evening, together, ~2.5 h)** | Run Ubaal, export CSVs | Data sheet, timekeeping | Video, safety | **TRIAL_PROTOCOL §0–§4 done**: baseline 3–5, v1 ≥ 5, Σ decay, response time |
| **Mon 23** | Replay + tune on v1 data (`replay.mjs`, `detector_eval.py`); freeze v2 config | Fill trials.csv, `make_all.sh`, update model defaults with the measured pot, Σ, response | Pick photos, foam-height table | Figures regenerated with real data |
| **Tue 24 (evening)** | v2 trials (2–5) together | Fill deck TO FILL boxes; appendix pages 1–3; export PDF/PPTX | Video edit (07_VIDEO) | Full draft PDF |
| **Wed 25** | Final check that the app link works | Proofread against `00_CONTEXT/CONTEXT.md`; AI declaration; contributions | Check every number against trials.csv | **Submit** |

**Critical path:** Sunday's trials. Everything else is already built. If Sunday slips, use `09_HOME_TRIAL_KIT/ZERO_HARDWARE_FALLBACK.md`.
