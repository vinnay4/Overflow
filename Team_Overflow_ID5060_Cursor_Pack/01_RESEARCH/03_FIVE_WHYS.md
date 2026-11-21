# Five Whys: one connected causal chain, each answer checked

| Why | Question | Answer | Checked against |
|---|---|---|---|
| 1 | Why did the milk spill? | Foam rose above the rim before anyone reacted. | Our baseline video (**TO FILL** frame numbers) |
| 2 | Why did the foam rise so fast? | At the boil, ~0.9 L of steam per second enters ~1 L of headspace. If bubbles survive, it fills in about a second. | P2 calculation (09_NUMBERS_CHEATSHEET.md); our video timing: first bubble → overflow = **__ s** |
| 3 | Why do the bubbles survive in milk but not in water? | Denatured whey proteins, casein and polar lipids coat the bubbles and give them a lifetime (Σ > 0). The skin also shields the foam from dry air. | [R1][R2][R7][R16]. Our water-vs-milk side-by-side video (**optional, TO FILL**) |
| 4 | Why does nobody react in time? | The only warning anyone uses is *visual* (foam appearing), and it comes seconds before the spill, while the person is elsewhere. | Our deck observation 4. Measured human response time **__ s** |
| 5 | Why is a visual cue the only one used? | Every common fix assumes a human closes the loop by watching. No early, non-visual signal reaches the user. | Evolution table (07_EVOLUTION…). 2026 AI hobs prove that sound and vibration signals exist [R29] |

**Root cause:** the control loop's only sensor is a person's eyes, and the visible cue arrives too late. The physics of foam (P2, P3, P5) explains why "too late" means seconds.

**Hypotheses (label them as such):** (H1) the hiss before the boil in milk follows the kettle pattern. (H2) foam over a skin collapses more slowly, giving runaway [R12]. (H3) the milk watcher was introduced in 1938 because of rising home milk boiling in the UK. The date is sourced ([R19]). *Why* it appeared is our hypothesis.
