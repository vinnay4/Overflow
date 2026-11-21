# Parameters (single source of truth; mirrored in app/src/assumptions.ts)

| Symbol | Default | Unit | Type | Source / how to get yours |
|---|---|---|---|---|
| V milk | 500 | mL | SCOPE | team deck (250–500) |
| D, H pot | 14, 10 | cm | **ASSUMED → MEASURE** | ruler |
| m_pot | 0.35 | kg | **ASSUMED → MEASURE** | kitchen scale |
| P_knob | 1740 | W | SOURCE | IS 4246 large burner ≥ 1490 kcal/h [R36] |
| η | 0.68 (gas) / 0.80 (induction) | – | SOURCE | [R36] / [R37] |
| T_start, T_amb | 8, 30 | °C | **ASSUMED → MEASURE** | thermometer, or fridge ~4–8 |
| h (loss) | 12 | W/m²K | ASSUMED → **CALIBRATE** | fit to measured time-to-boil |
| τ_b | 8 / 1.5 | s | ASSUMED | gas grate lag / induction |
| T_b milk | 100.5 | °C | SOURCE | [R11] |
| ρ_milk | 1030 | kg/m³ | SOURCE | [R9] |
| c_p milk | 3900 | J/kgK | SOURCE | [R10] (3.4–4.1 kJ/kgK) |
| c_steel | 500 | J/kgK | SOURCE | [R40] |
| ρ_v, h_fg | 0.598, 2.257e6 | kg/m³, J/kg | SOURCE | [R39] |
| T_skin onset | 70 | °C | SOURCE | [R3] |
| k_s | 1/45 | 1/s | ASSUMED | – |
| Σ₀, Σ_skin | 0.6, 4.0 | s | ASSUMED → **MEASURE** | `04_ANALYSIS/foam_fit.py` from a foam-decay video |
| ε | 0.85 | – | ASSUMED | typical wet foam |
| disc Σ factor | 0.45 | – | ASSUMED → MEASURE (if you buy a disc) | – |
| P_low | 350 | W | ASSUMED | "sim" on a gas burner, about ⅕ |
| T_cue (detector) | 88 | °C | ASSUMED → **MEASURE** | thermometer at the moment Ubaal fires, or back out from the lead time |
| human response | 15 | s | ASSUMED → **MEASURE** | `human_response_template.csv` |
