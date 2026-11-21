# Governing first principles (D.A.R.E. → Analyze)

Each principle is a fundamental truth (physics or chemistry), not a kitchen habit. Each one says which design lever it gives us.

| # | Principle | Equation / statement | Source | Lever it gives us |
|---|---|---|---|---|
| P1 | **Conservation of energy** | (m c_m + m_p c_p) dT/dt = ηP − losses. At T_sat, the extra energy goes into latent heat | thermodynamics; [R36][R39] | The heat flux P is a control knob |
| P2 | **Phase change magnifies volume** | V_steam/V_water = ρ_l/ρ_v ≈ 958/0.598 ≈ 1600 | [R39] | Small heat → huge gas volume (Magnify) |
| P3 | **Surfactant films give bubbles a lifetime** | Gibbs–Marangoni elasticity. Pure liquids do not foam | [R16][R1] | Σ is a property we can perturb |
| P4 | **Whey proteins denature above ~70–75 °C** and aggregate with casein and fat into a surface skin | first-order-like kinetics (order ≈ 1.5), Arrhenius in T | [R3][R5][R8] | The skin is time- and temperature-dependent, so there is a window |
| P5 | **Foam balance (production vs decay)** | dV/dt = Q − V/Σ ⇒ H_e = Σ U_g | [R15] | Overflow is a *rate* race, not a single event |
| P6 | **Dimensional homogeneity / Buckingham π** | 5 variables (H_e, Σ, Q_v, A, h_head), 2 dimensions → 3 groups. Π = ΣQ_v/V_free | course deck 07 | One number to design against |
| P7 | **Subcooled bubbles collapse noisily before the boil** | collapse noise ~0.1–1 kHz. Loudest before saturation | [R31][R32] | An early, non-visual signal exists |
| P8 | **A control loop is only as fast as its slowest element** | success ⇔ lead time > detection + human response + burner lag | control basics; course "ask the right question: think measures" | Earlier detection beats stronger heating cuts |

**Essential constraints (from our submitted problem statement):** full boil must be reached, no taste change, easy to clean, cost < ₹300, 250–500 mL packaged milk, steel pot, gas or induction, home kitchen.
