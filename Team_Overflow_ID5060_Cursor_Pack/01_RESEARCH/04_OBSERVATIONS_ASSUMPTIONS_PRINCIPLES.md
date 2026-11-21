# Observations vs assumptions vs principles (rubric step 3)

**Rule:** only things we actually saw or measured go in Observations. Everything else is an assumption to check, or a principle with a source.

## A. Observations (recorded by us). Fill with real values, dates and file names
| ID | Observation | Evidence file | Status |
|---|---|---|---|
| O1 | Water at a full boil does not overflow. Milk overflows within seconds of reaching a boil. | from submitted deck. Re-film: `video/O1_water_vs_milk.mp4` | in deck; re-film |
| O2 | A skin forms on the surface as milk heats. | photo `photos/O2_skin.jpg` | TO RECORD |
| O3 | The skin traps rising bubbles, which build up as foam and push over the rim. | video frames | TO RECORD |
| O4 | Common remedies (low flame, stirring, spoon) need the user at the stove. | team experience + interviews (n = __) | TO RECORD |
| O5 | A spill wastes milk, needs cleaning, and can put out a gas flame. | photo after spill, cleanup time __ min | TO RECORD |
| O6 | Baseline: stove-on → first bubble = __ s. First bubble → overflow = __ s. Max foam __ cm (n = __) | `04_ANALYSIS/data/trials.csv` | TO MEASURE |
| O7 | The pot makes an audible hiss well before boiling, which then changes character. | Ubaal recording `raw/<id>/…_audio.webm` | TO RECORD |
| O8 | Human response time from another room = __ s (n = __) | `data/human_response.csv` | TO MEASURE |

## B. Assumptions / hypotheses to check
| ID | Assumption | Why it matters | How we check | Result |
|---|---|---|---|---|
| A1 | "The skin alone causes boil-over" | Points to the wrong lever | Π analysis: overflow needs Σ·Q_v > V_free | Rejected as sole cause (principle P5/P6) |
| A2 | "A bigger pot solves it" | Common advice | Model + [R2]. Optional: trial in a wider pot | Model: delays. Needs ~24 cm at full flame |
| A3 | "Someone must watch the pot" | The constraint we attack | Ubaal trials | **TO TEST** |
| A4 | "Low flame always prevents boil-over" | Common advice | Model: needs Π < 1, so depends on timing and pot | Partly true |
| A5 | Milk's pre-boil hiss follows the kettle pattern (peak, then fade) | Basis of PRE_BOIL cue | Labelled recordings | **TO TEST** |
| A6 | Phone mic at 30–50 cm hears the hiss over the LPG burner roar | Feasibility | Spectrogram from first trial | **TO TEST** |
| A7 | Turning to sim at the cue still lets milk reach a full boil | Constraint "full boil" | Trial log: full_boil_reached | **TO TEST** |
| A8 | The disc lowers Σ (model ×0.45) | Refinement option | Paired trials | **TO TEST** (only if bought) |
| A9 | Model parameters Σ0, Σskin, h_loss, burner lag | Model accuracy | Fit to baseline | **TO FIT** |

## C. Governing principles and essential constraints
See `02_FIRST_PRINCIPLES.md` (P1–P8, sourced) and the constraints from our submitted deck: full boil, no taste change, easy to clean, < ₹300, 250–500 mL, steel pot, gas or induction.
