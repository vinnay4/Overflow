# Transformer worksheets (rubric step 4: what, maths operation, insight, how it changed the rebuild)

The course's transformer list (deck 06): Magnify, Scale, Approximate, Idealize, Normalize, Interpolate, Extrapolate, Aggregate, Decompose, Linearize, Change Frame, Perturb (+ Shift, Rotate, Superpose, Accumulate, Project, Iterate, Approach a Limit). We use **four** and lead with **Scale** and **Change Frame**. All numbers are reproducible with `04_ANALYSIS/dimensional_analysis.py` and are **MODEL** unless marked.

---
## T1 · Magnify (course: "multiplicative" magnification, like a gear ratio or the hydraulic A_large/A_small)
- **What we transformed:** the volume of water that turns to steam at the boil.
- **Maths operation:** multiplicative ratio V_steam/V_water = ρ_l/ρ_v = 958/0.598 ≈ **1602**. Steam rate Q_v = P_net/(ρ_v·h_fg).
- **Numbers:** P_net = 1740 W × 0.68 = 1183 W → 0.52 g/s water → **0.88 L/s steam**. Headspace (14 × 10 cm pot, 500 mL) = 1.04 L → t_fill = 1.2 s with no bursting.
- **Insight:** "Calm then sudden" is not mysterious. A ×1600 magnifier sits between the burner and the rim. Any cue that depends on *seeing foam* gives only ~1 s of warning.
- **Changed the rebuild:** we dropped every idea based on reacting to foam (e.g. a camera watching for foam) as the primary cue. The cue must come from the **subcooled phase, before the boil**.

## T2 · Scale (course: dimensional analysis, "why are there no small animals in polar regions", Gulliver ×1728, Buckingham π)
- **What we transformed:** pot size and heat rate versus the foam that fills the pot.
- **Maths operation:** Buckingham π. Variables H_e [L], Σ [T], Q_v [L³T⁻¹], A [L²], h_head [L]. k = 5, r = 2 → 3 groups:
  π₁ = H_e/h_head, π₂ = ΣQ_v/(A h_head) = **ΣQ_v/V_free = Π**, π₃ = A/h_head². Bikerman's linear law H_e = ΣU_g gives π₁ = π₂, so **overflow ⇔ Π > 1**.
  Scaling: V_free = A·H_pot − V_milk ∝ D²(H_pot − h_liq) → at fixed P, Π ∝ 1/D² (more than that, since h_liq also falls).
- **Numbers (Σ = 4.6 s ASSUMED):** D = 12/14/16/20/24 cm → Π_full = 6.4/3.9/2.7/1.5/1.0; Π_low (0.24 kW) = 1.3/0.78/0.54/0.31/0.20.
- **Insight:** a wider pot is a real lever but a weak one. You need about 24 cm for a 500 mL boil at full flame. That matches ATK's "4-quart pan for a pint" [R2], a sanity check, not a validation. **Cutting heat by 5× moves Π more than any pot we own, and costs nothing.**
- **Changed the rebuild:** design target became "make Π < 1 at the moment of boiling" by controlling Q_v, not by buying a pot.

## T3 · Approach a Limit (course: "Y = b/X: Y gets magnified fast as X → 0")
- **What we transformed:** time from steady steaming to overflow, as Π approaches 1.
- **Maths operation:** solve dH/dt = U_g/ε − H/τ with H(0) = 0 → H(t) = H_e(1 − e^(−t/τ)). Overflow when H = h_head:
  **t\* = −τ·ln(1 − 1/Π)**. As Π → 1⁺, t\* → ∞. As Π → ∞, t\* → εV_free/Q_v (the Magnify limit).
- **Numbers:** Π = 1.01/1.1/1.5/2/4/8 → t\* = 18/9.4/4.3/2.7/1.1/0.5 s.
- **Insight:** the danger is a **cliff**. You don't need zero heat, only Π just below 1 when the milk reaches the boil. The heat must already be reduced *before* the boil. Reacting after the boil leaves ~1 s.
- **Changed the rebuild:** it gave a timing spec. The alarm must fire early enough that response + burner lag finishes before the boil. That defines the "latency budget" used in T4.

## T4 · Change Frame (the pivot)
- **What we transformed:** the frame of the problem. From "how do we stop milk foaming?" (foam frame) to "who senses the boil coming, and how early?" (control-loop frame).
- **Maths operation:** a loop-latency inequality. **Success ⇔ L = t_boil − t_alarm > t_response + τ_burner + margin.** The model sweep (`fig_map_cue_response.png`) shows the safe region in (cue temperature, response time) space.
- **Insight:** the visual cue is late (Magnify). The *acoustic* cue is early: subcooled collapse noise peaks well before saturation ([R31][R32]). Commercial 2026 hobs already close this loop with sound or vibration ([R29]). A phone can do the same on any stove.
- **Changed the rebuild:** we built **Ubaal**, a phone web app that listens and alarms at PRE_BOIL, and tested it against the no-aid baseline.

## (Optional) T5 · Perturb, used for the refinement
- **What:** the skin and bubble lifetime Σ.
- **Operation:** Σ → kΣ (k < 1), S → S(1 − r) at each burst. So Π → kΠ.
- **Insight:** perturbation helps only while something keeps perturbing. A disc does that passively *and* rattles, a louder, regular cue for the app. This intersection of two ideas is the course's "Medici effect".
- **Use:** our refinement v2 if v1's lead time is too short on the big burner.

---
### Where the course's other magnification examples connect (for the viva)
- *Arrhenius* (deck 06): whey denaturation rate ∝ e^(−Ea/RT), with Ea ≈ 265–280 kJ/mol below 90 °C [R5]. A 10 °C rise near 80 °C multiplies the rate about 10×. This is why the skin appears "suddenly" in the last ~25 °C.
- *Exponential growth* (deck 06): the foam ODE's runaway hypothesis [R12] is positive feedback, like N₀e^(rt).
- *Resonance* (deck 06): the disc rattle and the pot's structural resonance are the narrow peaks the detector can lock onto.
