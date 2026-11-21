# Simulation app: spec (what exists + what Cursor may polish)

## Layout (1 page, 4 tabs, URL hash selects the tab)
- **Header:** "Why milk boils over: Π = Σ·Q_v / V_free" plus a red banner "Model estimates, not measurements".
- **#sim:** left = controls (grouped: Milk & pot · Heat · Milk physics · Fixes · Ubaal detector), right = pot animation (milk level, skin opacity = S, foam height = H, rim line, alarm flash), then 3 canvas charts stacked on a shared time axis: (1) temperature, (2) foam fill (H/headroom, red line at 1.0), (3) Π. Markers: first boil, alarm, knob↓, overflow. KPI chips: time to first boil · overflow? at s · alarm lead · max fill % · full boil reached.
  Play/pause, ×1/×5/×20 speed, Reset, and "Load scenario" dropdown.
- **#compare:** table (scenario · transformer · first boil s · overflow s · max fill · reached boil · alarm lead) + an overlay chart of foam fill for all scenarios. F is highlighted as "chosen v1" and H as "refinement v2".
- **#transformers:** 5 cards (see `01_RESEARCH/05_TRANSFORMER_WORKSHEETS.md`) with live mini-charts: Π vs D (Scale), steam L/s vs power (Magnify), t\* vs Π (Limit), Σ factor slider (Perturb), latency-budget bar (Change Frame).
- **#assumptions:** a parameters table generated from one array in `src/assumptions.ts` (value, unit, type, source).

## Acceptance criteria
- Defaults reproduce the Python model (`model_scenarios.csv`) to about ±0.5 s for baseline first boil and overflow. Check by hand, or add a vitest that reads the CSV.
- Scenario F shows "no overflow" and H shows "no overflow". The baseline overflows within ~2–3 s of first boil (model).
- Works offline after build, at 1280×720 and on a phone (single column below 800 px).
- Every number shown carries its unit. The banner can't be hidden.
- Screenshots for the deck: `#sim` with the baseline run to overflow, and `#transformers` (already in `05_DECK/deck/assets/`).

## Nice-to-have (only if time allows, in priority order)
1. "Import my trial" button: load `trials.csv` and overlay measured events (first bubble, overflow) on the model chart. This is the strongest model-vs-reality visual.
2. Export the current chart as PNG.
3. A Hindi/English label toggle.
