# Alternatives (rubric step 5: ≥ 3 meaningfully different, compared against target, constraints and trade-offs)

Every alternative attacks one term of **Π = Σ·Q_v/V_free**, so the comparison follows from first principles, not taste. Data: `alternatives_matrix.csv` and `alternatives_weights.csv`. Script: `04_ANALYSIS/alternatives_matrix.py` (with a weight-sensitivity check).

| ID | Alternative | Π term | Transformer | Mechanism | Model result (500 mL, 14 cm pot, LPG) | Score |
|---|---|---|---|---|---|---|
| **F** | **Ubaal phone app: alarm, then turn to sim (chosen v1)** | Q_v (timed) | Change Frame + Approach a Limit | Hear the pre-boil hiss and prompt a knob-down with lead time | no boil-over, full boil, 24 s lead (cue 88 °C ASSUMED) | **85** |
| H | Ubaal + milk-watcher disc (refinement v2) | Q_v + Σ | + Perturb | Disc lowers Σ and adds a rattle cue | no boil-over, max foam 10 % of headroom | 83 |
| B | Heat-flux rule: sim at ~92 °C (by timer) | Q_v | Approach a Limit | Arrive at the boil with Π < 1 | no boil-over; boil +26 s slower | 81 |
| G | Automatic power cut (sensor hob / induction + relay) | Q_v | Change Frame | Machine closes the loop | no boil-over (induction) | 79 |
| C | Milk-watcher disc alone | Σ | Perturb | Large bubbles break the skin; rattle | no boil-over *if* Σ×0.45 (ASSUMED) | 78 |
| E | Silicone flower lid | V_free | Scale | Catches foam and drains it back | +4 cm alone not enough at full flame | 70 |
| A | Wider pot (20 cm) | V_free | Scale | More room | delays overflow ~26 s, does not prevent | 69 |
| I | Double-walled milk boiler | Q_v | Change Frame | Water jacket + whistle | not modelled | 65 |
| D | Spoon, stirring, butter | Σ | Perturb | Burst bubbles (temporary) | stirring every 10 s still overflows | 64 |

**Weights** come from our submitted constraints: prevents unattended 30, no watching 15, cost ≤ ₹300 15, full boil 10, taste 10, clean 10, gas + induction 5, testable by us by 25 Nov 5.
**Robustness:** F stays the winner under 15 of 16 single-weight ±50 % perturbations. H wins the other one.

## Choice and mechanism
**Ubaal v1 (F).** The phone listens. When the subcooled hiss has peaked and faded by 4 dB (PRE_BOIL), it beeps, vibrates and speaks "turn the flame to sim". Q_v falls by about 5× before the boil, so Π < 1 at the boil (T2, T3), and foam settles at a steady height below the rim. The milk still reaches a full boil, more slowly. The user never watches. They respond to one alarm.

**Why not G?** It is the ideal loop (no human), but it needs new hardware, fails the ₹300 limit, and does not work on gas. It is our *next step*.
**Why not C alone?** Its effect size is not measured. It is our *refinement* option, which also gives a rattle the app can hear.

## Trade-offs to state on slide 6
Slower boil after the cue. Phone placement. A person still turns the knob on gas. False alarms (pressure cooker, exhaust fan, second pot). Battery and mic permissions.
