# 02_SIMULATION: "Why milk boils over" interactive model (the software prototype of the analysis)

**What it is:** a browser app (Vite + TypeScript, no backend) that runs the lumped heat-foam model live. It does four things:
1. **Simulator:** sliders for volume, pot size, flame, skin strength, disc, stirring, lid, auto-low, and Ubaal detector + response time. Live pot animation, T(t), foam fill vs headroom, Π(t), and event markers (first boil, alarm, knob down, overflow).
2. **Compare:** the 10 named scenarios (baseline, A–H, F′) in one table and one overlay chart. This is the same set as `04_ANALYSIS/param_sweep.py`.
3. **Transformers:** 5 cards (Scale, Magnify, Approach a Limit, Perturb, Change Frame). Each has the maths, a mini chart, the insight and the "changed our rebuild" line.
4. **Assumptions & sources:** every parameter with value, type (SOURCE / ASSUMED / TO MEASURE) and citation.

> Every output is an **ESTIMATE from a model with assumed parameters**. The app labels it as such. Never paste a sim number on slide 5 as a measurement.

## Run
```bash
cd 02_SIMULATION/app
npm install
npm run dev        # http://localhost:5173  (tabs: #sim #compare #transformers #assumptions)
npm test           # vitest: 5 tests (baseline overflows soon after first boil; ×1600 and 0.88 L/s; Π and t* closed forms; B, F, G, H prevent overflow and still boil; late alarm F′ fails)
npm run build      # static site in dist/ (base "./", opens from file:// or any static host, e.g. GitHub Pages)
```
Verified on 21 Nov 2026 (IST): `npm test` 5/5 passed, and `npm run build` succeeded.

## After you measure (important)
Set `DEFAULTS` in `src/model.ts` **and** `Params` in `04_ANALYSIS/milk_model.py` to your measured values: pot D, H and mass, start temperature, `hLoss` (fit so the model's time to boil matches your measured baseline), Σ from `foam_fit.py`, `humanResponseS`, and `detectorTriggerC` (the temperature where the app actually fired, from a thermometer or from the lead time). Then rerun `npm test` and `make_all.sh`. Keep both files in sync by hand. No automated test compares them yet, so after edits run `python 04_ANALYSIS/param_sweep.py` and check that `model_scenarios.csv` matches the app's Compare tab. If you change the defaults, update the `tests/model.test.ts` expectations.

Docs: `SPEC.md` (UI/behaviour), `EQUATIONS.md` (the model), `PARAMETERS.md` (table of values and sources).
