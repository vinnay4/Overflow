# Team Overflow · ID5060 First Principles Tools · Term Project pack
**Problem:** milk boils over. **Solution:** **Ubaal (उबाल): a phone that listens for the pre-boil hiss and tells you to turn the flame to sim before the milk boils over.** "Listen, don't watch."
Due **25 Nov 2026**. Team, listed as on the slides: Vinnay Gupta ED22B073, Vinay Chekuri EE22B026 (representative), Atharva Chinchalkar BS22B010. A designer’s brief for the six slides is `PRESENTATION_BRIEF.md`. A drawn, untested rim clip is in `10_RIMCLIP/`.

## Start here (for Cursor and for humans)
1. Open this folder in Cursor. Tell it: *"Read README.md, 00_CONTEXT/*.md and 08_PROMPTS_FOR_CURSOR.md. Then run prompt P0."*
2. Most of the work is **already built and tested**. Cursor's job is to polish, connect real data, and export. The team's job is **one evening of real trials** (`09_HOME_TRIAL_KIT/TRIAL_PROTOCOL.md`).
3. **Golden rule:** nothing synthetic or modelled may be shown as measured. Model numbers are tagged MODEL. Example data files are prefixed `EXAMPLE_`. Placeholders say TO FILL or `__`.

## What this build can be submitted as
The six-slide deck, the two-page appendix, and a 71-second demo of the app and the model are exported (see the root README). Kitchen trials were not run. Every unmeasured result is labelled untested, and model numbers are labelled MODEL. Do not replace those labels with invented counts.

## The story in 6 lines
1. **Baseline:** milk sits calm for ~3 min, then overflows within seconds of the first bubble. Every fix needs someone watching (our deck; measure n = 3–5).
2. **Deconstruct (Five Whys):** the root cause is not the milk but the **sensor**. The only early-warning loop is a human eye, and the visible cue comes ~1 s before the spill.
3. **Principles → one number:** Buckingham π gives the **boil-over number Π = Σ·Q_v/V_free** (bubble lifetime × steam rate ÷ headroom). Π > 1 ⇒ boil-over.
4. **Transformers:** *Magnify* (×1600 steam: 0.9 L/s into a 1 L headspace), *Scale* (Π ∝ P/D²: a bigger pot is a weak lever; less heat is a strong one), *Approach a Limit* (t\* = −τ ln(1 − 1/Π): a cliff, so arrive at the boil with Π just < 1), *Change Frame* (swap the sensor: the pot is loudest in the subcooled hiss *before* the boil).
5. **Rebuild:** 9 alternatives, each attacking one term of Π, weighted on our constraints → **F = Ubaal app (₹0) wins (85)**. H = app + ₹295 milk-watcher disc is the refinement path (83).
6. **Evaluate:** Ubaal also logs ground truth. Baseline vs v1 vs v2 in unattended trials (target 0/10), one refinement, honest limits. Next step: close the loop on induction (auto power cut).

## Folder map
| Folder | What | Status |
|---|---|---|
| `00_CONTEXT/` | Brief, our submitted deck, course frameworks, rubric map, 4-day plan; original PDFs + text | ✅ |
| `01_RESEARCH/` | Research notes, first principles, Five Whys, O/A/P, transformer worksheets, alternatives (+CSV), evolution, system map, numbers cheat-sheet, **40 references with URLs**, .bib | ✅ |
| `02_SIMULATION/` | Vite + TS interactive model (sim, compare, transformers, assumptions) + spec, equations, parameters | ✅ builds, 5/5 tests |
| `03_DETECTOR_APP/` | **Ubaal** PWA (mic FFT → state machine → alarm; labels + CSV/audio export), replay tool, synthetic tests, specs, test plan, camera-mode spec | ✅ 3/3 tests |
| `04_ANALYSIS/` | Python model, dimensional analysis, sweeps, alternatives scoring, trial plots (Fisher exact), Σ fit, detector eval, data templates | ✅ all run |
| `05_DECK/` | 6-slide HTML deck (1920×1080, speaker notes) → PDF/PNG/PPTX; slide content, design system, visuals list | ✅ exported; has TO FILL boxes |
| `06_APPENDIX/` | 4-page appendix draft + contributions | ◐ needs real data |
| `07_VIDEO/` | ≤ 2-min storyboard | ◐ needs footage |
| `08_PROMPTS_FOR_CURSOR.md` | Phase-by-phase prompts P0–P9 | ✅ |
| `09_HOME_TRIAL_KIT/` | One-evening protocol, shot list, printable sheet, zero-hardware fallback | ✅ |
| `AI_USE_DECLARATION.md` | Required declaration (edit) | ◐ |

## Build order and commands
```bash
# 1. analysis + figures
cd 04_ANALYSIS && python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt && bash make_all.sh
# 2. simulator
cd ../02_SIMULATION/app && npm install && npm test && npm run dev
# 3. detector
cd ../../03_DETECTOR_APP && npm test && npm run serve      # mic needs https on a phone; see README there
# 4. deck
cd ../05_DECK && bash export_pdf.sh && python3 build_pptx.py   # needs Chrome and python-pptx
```

## Acceptance criteria for "done"
- [ ] ≥ 3 baseline and ≥ 5 Ubaal milk trials in `04_ANALYSIS/data/trials.csv` (or the fallback, stated honestly).
- [ ] No `TO FILL` / `__` left in the deck or appendix (`grep -rn "TO FILL\|__" 05_DECK/deck 06_APPENDIX`).
- [ ] Model defaults updated with the measured pot, Σ and response time; figures regenerated.
- [ ] One refinement documented (or evidence for keeping v1).
- [ ] Deck ≤ 6 slides, appendix ≤ 4 pages, video ≤ 2 min. Names + roll numbers on slide 1. Contributions + AI declaration in the appendix.
- [ ] Every number on slides 5–6 is traceable to `trials.csv`.

## Slimmed to under 100 files
To fit Cursor's 100-file upload limit, generated files were removed; they rebuild in one command each:
- Analysis figures and CSVs: `pip install -r 04_ANALYSIS/requirements.txt` then `bash 04_ANALYSIS/make_all.sh` (the deck's copies of the figures are kept in `05_DECK/deck/assets/figures`).
- Slide PNGs: `bash 05_DECK/export_pdf.sh` (the PDF and PPTX are kept in `05_DECK/export`).
- `02_SIMULATION/app/package-lock.json`: created by `npm install`.
- The 7 PDF text versions are merged into `00_CONTEXT/ALL_SOURCE_TEXT.md`, and the five context notes into `00_CONTEXT/CONTEXT.md`.
