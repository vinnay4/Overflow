# Numbers cheat-sheet (for the viva). MODEL = computed from the equations with labelled assumptions

| Quantity | Value | Type | How |
|---|---|---|---|
| Steam/water volume ratio at 100 °C | ≈ 1600 | SOURCE-derived | 958/0.598 [R39] |
| Net power, 1.74 kW LPG burner at 68 % | 1183 W | SOURCE-derived | [R36] |
| Water boiled off at that power | 0.52 g/s | derived | 1183/2.257e6 |
| Steam volume rate | 0.88 L/s | derived | ÷ 0.598 kg/m³ |
| Headspace: 14 × 10 cm pot, 500 mL | 1.04 L | ASSUMED pot | πD²/4·H − V |
| Fill time if no bubble bursts | 1.2 s | MODEL | V_free/Q_v |
| Heat capacity: 500 mL milk + 0.35 kg pot | ≈ 2180 J/K | ASSUMED pot mass | m c + m_p c_p |
| Heating rate at full power | ≈ 0.54 K/s | MODEL | 1183/2180 (minus losses) |
| Time 8 → 100 °C (no losses) | ≈ 170 s. Model with losses ≈ 178 s | MODEL | — |
| Π at full flame, 14 cm pot, Σ = 4.6 s | 3.9 | MODEL (Σ assumed) | ΣQ_v/V_free |
| Max net power with Π < 1 (14 cm / 20 cm) | ≈ 305 W / 775 W | MODEL | V_free/(Σ·…) |
| t\* at Π = 4 | 1.1 s | MODEL | −τ ln(1 − 1/Π) |
| Alarm lead at cue 88 °C | ≈ 24 s | MODEL (cue temp ASSUMED) | sim |
| Kettle sound peak / drop | 60–70 °C peak; > 10 dB(A) quieter at ~95 °C | SOURCE (kettle, water) | [R31] |
| Subcooled collapse noise band | ~100 Hz–1 kHz | SOURCE | [R32] |
| Whey denaturation threshold | > 70–75 °C | SOURCE | [R3] |
| β-Lg Ea below 90 °C | 265–280 kJ/mol → ≈ ×12 rate from 80 → 90 °C | SOURCE + derived | [R5] |
| Milk boiling point | ≈ 100.5 °C | SOURCE | [R11] |
| Disc price | ₹295 (21 Nov 2026) | SOURCE | [R21] |
| Our baseline first bubble → overflow | **__ s** | MEASURED | trials |
| Our human response | **__ s** | MEASURED | trials |
| Ubaal real lead time | **__ s** | MEASURED | trials |
