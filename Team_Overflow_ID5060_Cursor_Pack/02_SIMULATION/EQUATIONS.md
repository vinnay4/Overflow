# Model equations (lumped, 0-D in space). Implemented identically in `app/src/model.ts` and `04_ANALYSIS/milk_model.py`

State: milk temperature T, skin coverage S ∈ [0,1], foam height H, delivered heat P_f.

1. **Burner lag:** dP_f/dt = (η·P_knob − P_f)/τ_b   (η = 0.68 LPG [R36] / 0.80 induction [R37]. τ_b ASSUMED 8 s gas, 1.5 s induction)
2. **Losses:** L = h·A_exp·(T − T_amb), A_exp = A + ½·πDH   (h ASSUMED 12 W/m²K, *calibrate*)
3. **Vapour fraction of net heat:** g(T) = 1/(1 + exp(−(T − (T_b − 2))/0.7)), and g = 1 at T_b = 100.5 °C [R11]. (A smooth stand-in for subcooled → saturated boiling, ASSUMED.)
4. **Energy:** C·dT/dt = (1 − g)(P_f − L),  C = m·c_p + m_pot·c_steel   (c_p = 3900 J/kgK [R10], c_steel = 500 [R40])
5. **Steam volume rate (Magnify):** Q_v = g·max(P_f − L, 0)/(ρ_v·h_fg),  U_g = Q_v/A   (ρ_v = 0.598, h_fg = 2.257 MJ/kg [R39])
6. **Skin growth (Arrhenius-like onset above 70 °C [R3]):** dS/dt = k_s·max(0, (T − 70)/(T_b − 70))·(1 − S)   (k_s ASSUMED 1/45 s⁻¹)
7. **Foaminess (Bikerman Σ [R15]):** Σ = Σ₀ + Σ_skin·S   (Σ₀ = 0.6 s, Σ_skin = 4.0 s, both ASSUMED, *measure with foam_fit.py*). Disc: Σ × 0.45 and S × 0.6 every 3 s (ASSUMED). Stir: S × 0.1 and H × 0.3 every period.
8. **Foam height:** dH/dt = U_g/ε − H/τ,  τ = Σ·ε   (ε = 0.85 gas fraction, ASSUMED). Steady state H_e = Σ·U_g (Bikerman).
9. **Boil-over number:** Π = Σ·U_g/h_head = Σ·Q_v/V_free. **Overflow when H ≥ h_head** (⇔ Π > 1 at steady state).
10. **Closed form at constant Σ, Q_v (Approach a Limit):** t\* = −τ ln(1 − 1/Π).
11. **Control:** auto-low at T ≥ T_set → P_knob = P_low (350 W). Detector: alarm at T ≥ T_cue (stand-in for the acoustic PRE_BOIL), knob → P_low after the response delay (human 15 s ASSUMED, auto 0 s).

**Dimensional check:** [Σ] = s, [Q_v] = m³/s, [V_free] = m³ → Π is dimensionless ✓. [U_g/ε] = m/s ✓.

**Known simplifications (state them on slide 6):** no spatial temperature field; bubble nucleation rate set by g(T), not wall superheat; Σ is constant per skin state (real foams drain and coarsen); the disc effect is a guess; heat loss is lumped; an alarm temperature stands in for the acoustic signature.
