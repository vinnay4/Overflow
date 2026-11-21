# Prompts for Cursor (paste one at a time; each assumes the repo root = this folder)

**Global rules to paste first (or put in `.cursorrules`):**
> You are helping Team Overflow finish an ID5060 First Principles term project due 25 Nov 2026. Read README.md and 00_CONTEXT/*.md first. Hard rules: (1) Never invent measurements. Real data lives only in 04_ANALYSIS/data/trials.csv and data/raw/. (2) Model outputs must be labelled MODEL. EXAMPLE_* files must never appear in the deck. (3) Every factual claim needs a reference from 01_RESEARCH/REFERENCES.md. If you add one, add it there with a URL. (4) Keep the deck at exactly 6 slides at 1920×1080. (5) Keep 02_SIMULATION/app/src/model.ts and 04_ANALYSIS/milk_model.py consistent. (6) Run the tests after code changes.

---
**P0 · Orient and verify (10 min)**
> Read the README, 00_CONTEXT, 01_RESEARCH/05_TRANSFORMER_WORKSHEETS.md and 05_DECK/SLIDES_CONTENT.md. Then run: the analysis (`04_ANALYSIS/make_all.sh` in a venv), `npm install && npm test && npm run build` in 02_SIMULATION/app, `npm test` in 03_DETECTOR_APP, and `05_DECK/export_pdf.sh`. Report anything that fails and fix it. Summarise the project story back to me in 6 lines and list every TO FILL item.

**P1 · Deploy Ubaal to a phone**
> Make 03_DETECTOR_APP/app deployable to GitHub Pages (a workflow in .github/workflows that publishes app/ and the built simulator under /sim). Check the service worker caches the right files and the manifest icons exist (generate simple PNG icons, a white pot with an orange wave). Give me the exact git commands. Then add a Hindi voice-alert toggle (hi-IN speechSynthesis) and a "Test alarm" button.

**P2 · Polish the simulator**
> In 02_SIMULATION, implement the nice-to-haves in SPEC.md in order: (1) an "Import my trial" button that reads trials.csv and overlays the measured first-bubble/overflow times on the model chart, (2) PNG export of the charts. Keep the "Model estimates" banner. Add tests.

**P3 · After the trials: data in**
> I have filled 04_ANALYSIS/data/trials.csv, foam_decay.csv, human_response.csv and data/raw/*. Validate the CSVs (types, missing values, is_example must be absent/0), then run plot_trials.py, foam_fit.py and detector_eval.py. Report: baseline n and mean ± SD for first bubble → overflow; boil-overs per condition with Fisher exact p; Ubaal lead times (median, range); misses; false alarms; fitted Σ.

**P4 · Calibrate the model**
> Update DEFAULTS in model.ts and Params in milk_model.py with our measured pot D/H/mass, start temperature, fitted Σ (split into sigma0 + sigmaSkin so the total matches), human response time and the measured cue temperature or lead. Fit hLoss so the model time-to-boil matches our measured mean. Update the test expectations, rerun everything, and tell me which conclusions changed (e.g. the Π values, the max safe power, whether F still prevents overflow in the model).

**P5 · Refinement analysis**
> Using only the v1 recordings, replay them with tools/replay.mjs and search dropDb ∈ {2,3,4,5}, minPeakHoldS ∈ {2,3,5} for maximum median lead time subject to zero false alarms on the noise-only recording. Write the chosen cfg.json, a short REFINEMENT.md (what was wrong in v1, what changed, why), and put the config into app.js. Do NOT touch v2 data.

**P6 · Fill the deck**
> Replace every TO FILL box in 05_DECK/deck/index.html with real figures and numbers from the analysis outputs and our photos in 05_DECK/deck/assets/photos/. Use the honesty tags (MODEL / MEASURED). If a number is missing, remove the element and add a limitation instead of a placeholder. Keep the text sizes and check nothing overflows (screenshot each slide with export_pdf.sh and look at the PNGs). Update the speaker notes to match. Then re-export the PDF and PPTX.

**P7 · Editable PPTX (if the portal wants editable slides)**
> Write 05_DECK/build_pptx_editable.py with python-pptx that rebuilds the 6 slides as native text boxes, tables and images (figures as PNG) following DESIGN_SYSTEM.md, with the speaker notes. Fonts: Georgia for headlines, Calibri for body (safe on any PC).

**P8 · Appendix**
> Turn 06_APPENDIX/APPENDIX_DRAFT.md into a ≤ 4-page A4 PDF (HTML + print CSS, or a LaTeX article using references.bib). Fill it from trials.csv, the analysis outputs, CONTRIBUTIONS.md and AI_USE_DECLARATION.md. Check the page count is ≤ 4.

**P9 · Final audit**
> Audit the submission against 00_CONTEXT/CONTEXT.md, row by row. Check: 6 slides; names + roll numbers on slide 1; ≥ 2 transformers each with operation/insight/rebuild; ≥ 3 alternatives; before/after with n; a refinement; limitations; measured vs estimated separated; references; AI declaration; contributions; no EXAMPLE_ or TO FILL anywhere; every number on slides 5–6 matches trials.csv. Output a pass/fail table and fix the fails.
