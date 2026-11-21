# Research notes: why milk boils over and what stops it

Research done 21 Nov 2026 with web search, reading papers, patents and product pages. Each claim carries a reference tag [Rn] from `REFERENCES.md`. **TO BE MEASURED** marks numbers no source gives us, which our own trials must supply.

---
## 1. The mechanism, step by step

| Step | What happens | Evidence |
|---|---|---|
| 1. Heating | 250–500 mL milk (ρ ≈ 1030 kg/m³, c ≈ 3.9 kJ/kg·K) warms on a 1.2–1.3 kW net burner or hob. From fridge temperature to the boil takes a few minutes. | [R9][R10][R36][R37]. Our own time-to-boil: **TO BE MEASURED** |
| 2. Whey denaturation | Minor whey proteins start to unfold at ~65 °C. β-lactoglobulin and α-lactalbumin denature significantly above 70–75 °C, then aggregate with κ-casein. | [R3][R4][R5] |
| 3. Skin formation | Denatured protein and fat collect at the air–water interface as a micron-thick hydrogel. Evaporation concentrates it. Viscosity rises above 65 °C. | [R1][R8][R9][R11] |
| 4. Bubble nucleation | Vapour bubbles form on the hot pot floor (heterogeneous nucleation). While the bulk is subcooled they rise into cooler milk and **collapse**, which makes the loud hiss (~100 Hz–1 kHz). | [R31][R32][R33] |
| 5. Bubbles survive | Near saturation, bubbles reach the surface. In milk, proteins (casein micelles, whey) and polar lipids coat them, giving the films Gibbs–Marangoni elasticity. **Water has no surfactant, so its bubbles burst at once and water does not foam.** | [R1][R2][R7][R16] |
| 6. Foam grows | Foam volume follows production − collapse. In Bikerman's dynamic test the steady height is H_e = Σ·U_g, where Σ is the mean bubble lifetime and U_g the superficial gas velocity. Foam over a skin is shielded from dry air, so its collapse slows (positive feedback, hypothesis [R12]). | [R15][R1][R12] |
| 7. Overflow | When the foam height exceeds the headroom (pot height − milk depth), milk goes over the rim. On gas this can put out the flame. | [R38]. Time from first bubble to overflow: **TO BE MEASURED** |

### The Magnify insight: why it happens "in seconds"
- 1 kg of water at 100 °C becomes 1/0.598 = 1.67 m³ of steam: **×1600** by volume ([R39]).
- A 1.74 kW LPG burner at 68 % gives about 1.18 kW to the pot ([R36]). At the boil, every watt makes steam: 1183/2.257×10⁶ = **0.52 g/s of water → 0.88 L/s of steam**.
- A 14 cm × 10 cm pot with 500 mL milk has about 1.04 L of headspace (**pot size ASSUMED, measure yours**). If no bubble bursts, it fills in **≈1.2 s**. That explains observation 1 in our submitted deck: "milk overflows within seconds of reaching a boil".

### Why water does not boil over (observation 1)
Pure water has a constant surface tension. When a film stretches there is no restoring gradient (no Gibbs–Marangoni elasticity), so bubbles rupture as they reach the surface ([R16]). Σ_water ≈ 0, so Π ≈ 0. Pasta water boils over because starch acts like milk's proteins ([R22]).

### Temperature dependence of milk foam (nuance)
Lab sparged-foam studies show milk foam stability peaks near 45 °C and *falls* at 65–85 °C ([R6][R7]). The casein fraction still gave a ~35 min half-life at 85 °C. So boiling milk foams not because foam is most stable at 100 °C, but because **steam production is enormous (Magnify) while bubble lifetime is still non-zero and the skin shields the foam**. Fat is antifoaming at 15–45 °C ([R6]), which links to "butter on the rim" ([R17]).

---
## 2. Existing fixes and *why* they work (or don't)

| Fix | Mechanism | Evidence of effect | Our Π term |
|---|---|---|---|
| Stand and watch, lower the flame when it rises | Human sensor + heat-flux control | Works only while someone watches (our deck obs. 4) | Q_v |
| Low flame throughout | Lower Q_v | Recommended by [R22]. Slow | Q_v |
| Stirring | Breaks the skin, releases bubbles | [R1] | Σ |
| Wooden spoon across the pot | Cool, dry, porous surface bursts bubbles. Fails once hot and wet | [R22]; ATK: delay only [R2] | Σ (temporary) |
| Butter or fat on the rim | Oil lenses bridge and rupture films (antifoam) | ATK: delay only [R2]; mechanism [R17] | Σ |
| Bigger, wider pot | More free volume. Larger bubbles in a wide pan pop more easily | ATK: the only sure fix was a 4-qt pan for a pint [R2]; Pugh: narrower vessel → taller foam [R15] | V_free (and Σ) |
| Milk-watcher disc (since 1938) | Collects steam into large bubbles that burst the skin, circulates liquid, rattles as an alarm | [R18][R19][R20]. Indian product ₹295 [R21]. **Size of effect TO BE MEASURED** | Σ + acoustic alert |
| Silicone flower lid | Vents steam, catches foam, drains it back | Manufacturer [R23]. €34.95 | V_free |
| Double-walled whistling milk boiler | Water jacket limits wall temperature. Whistle alert | Vendor descriptions [R24] | Q_v + alert |
| Capacitive spill sensing on induction hobs | Detects liquid on the glass, cuts power | Panasonic patents [R25][R26]. Reacts *after* spill starts | Q_v (late) |
| 2026 AI hobs | Samsung: vibration frequency. Cuckoo: sound sensor. LG: learned boil prediction. All cut power automatically | [R29] | Q_v (early, automatic) |

**Gap we exploit:** the 2026 hobs prove that *sound and vibration predict boil-over early enough to act*. But they need a ₹30,000+ appliance (price not verified, so do not quote it). Every Indian kitchen already has a microphone: the phone. Our rebuild brings that principle to any gas or induction stove at ₹0.

---
## 3. Acoustic signature (basis for Ubaal)
- Subcooled boiling: bubbles implode in cooler liquid and give broadband noise ~100 Hz–1 kHz ([R32][R33]).
- Kettle: sound power peaks at **60–70 °C** and drops **>10 dB(A)** by ~95 °C. The wheeze gives way to deep bubbling just before boiling ([R31]).
- Kettle peaks seen at 300, 550 and 1419 Hz (bubble rupture + structural resonance) (SPIE Proceedings kettle-noise study, doi:10.1117/12.3079217).
- Prior art: Boilarm (Arduino + phone, water) ([R34]). Cuckoo AI sound sensor ([R29]). Samsung hood patent with an audio sensor ([R28]).
- **TO BE MEASURED for milk in a steel pot on LPG:** (a) does the hiss peak and fade the same way, (b) at what milk temperature or time, (c) lead time from the PRE_BOIL cue to the first bubble at the surface, (d) whether a disc rattle is detectable over the burner roar.

---
## 4. Numbers no source gave us: TO BE MEASURED (our trials)
1. Time from stove-on to first bubble, and to overflow (baseline, n ≥ 3).
2. Time from first bubble to overflow. Foam height vs time (video + ruler).
3. Foam collapse half-life after cutting heat → Σ (`04_ANALYSIS/foam_fit.py`).
4. Our pot's inner diameter, height and mass. Burner type (small or large).
5. Human response time from alarm to hand on knob, from another room (`data/human_response_template.csv`).
6. Burner lag: knob turned down → bubbling subsides (gas vs induction).
7. Ubaal lead time and false alarms on real recordings.
8. Disc effect (if bought): paired trials with and without the disc.

## 5. Things we deliberately do NOT claim
- No claim that the disc "prevents" boil-over. Sources say it *reduces the tendency* or "helps".
- No price for AI hobs (not verified).
- No claim that milk acoustics equal kettle acoustics. Kettle data is the *hypothesis* we test.
