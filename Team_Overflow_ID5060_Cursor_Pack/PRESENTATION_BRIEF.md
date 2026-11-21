# Presentation brief — Team Overflow, ID5060

Give this file to whoever builds the slides. It is the whole story. They do not need the rest of the repository to get the claims right, and they must not add claims that are not in here.

Course: **ID5060 First Principles Tools**, term project, IIT Madras. Due **25 November 2026**.

Team, in this order on slide 1 and in the appendix:

1. **Vinnay Gupta · ED22B073**
2. **Vinay Chekuri · EE22B026** (representative on the October problem deck; keep that word on his name)
3. **Atharva Chinchalkar · BS22B010**

Product name: **Ubaal (उबाल)**. Line under it: **listen, don't watch.**

## What to make

- **Six slides. Not seven.** 16:9, 1920×1080. Assertion-evidence: every headline is a full sentence, and the evidence sits under it.
- One diagram or annotated sketch is required. We have both. Neither is a photograph of our pot.
- Speaker notes on every slide, from the notes in this file.
- An evidence appendix already exists (two to three pages). Do not paste it into the deck.
- Optional, if a slide has a spare corner: the Rimclip drawing. Rules for that drawing are at the end. It is not the chosen solution.

## Rules that will fail the project if you break them

- Do not invent a kitchen measurement. **No trial has been run. n = 0.**
- Do not draw the diagram as a photo, and do not add a stock photo of spilled milk.
- Every number from the simulator is a **MODEL** estimate. Colour it blue, or write MODEL next to it. Never green.
- Green is only for something measured. In this deck, nothing about the boil is green.
- Amber is for an assumption or for UNTESTED.
- Do not write TO FILL, blanks, or “about 10 seconds” if this file gives a different number.
- Do not say the phone “prevents boil-over” as a fact. Say the model does, and the kitchen test is open.
- Do not make the rim clip the hero. A clip that falls when the foam is already up is the wrong idea. The drawn clip is untested.
- The October problem deck listed Vinay Chekuri first, as representative. Do not rewrite that history. On **these** slides, Vinnay Gupta is first.

## Look

- Ground **#FAF7F0**. Ink **#1F2A33**. Accent **#C2410C** for the chosen path and the big numbers. Muted **#6b6357**.
- Blue **#1d4ed8** = model. Amber **#f59e0b** = untested or assumed. Green **#15803d** = measured (unused for outcomes here). Red **#b91c1c** = overflow.
- Headlines in a serif (Fraunces or Georgia). Body in a grotesque (DM Sans or Calibri). Equations in a mono.
- Cards with a soft radius, lots of margin, no clip-art. Footer on every slide: left, a source or a limit; right, Team Overflow · ID5060 · Nov 2026, except where a slide below says otherwise.
- Hindi product name is उबाल. Keep the macron-free spelling Ubaal in English.

## The argument, in one pass

Milk sits still, then climbs the rim in seconds. Every usual fix needs a person at the stove. The root cause is the sensor, not the milk: nothing early and non-visual reaches the cook.

One number decides it. **Π = Σ · Qᵥ / V_free.** Bubble lifetime, times the volume of steam per second, divided by the room above the milk. If Π is above 1, the steady foam is taller than the headroom.

Four moves, from the course:

1. **Magnify.** Liquid becomes steam at about 1600 times the volume. A 14 cm pot makes about 0.9 litres of steam a second into about 1 litre of headroom.
2. **Scale.** A wider pot helps as 1/D², and it is a weak lever. At full flame the model still overflows at 20 cm and only reaches Π = 1 near 24 cm.
3. **Approach a limit.** Time-to-overflow goes to infinity as Π approaches 1 from above. You do not need the flame off. You need Π just under 1 at the moment of boiling.
4. **Change frame.** Stop watching the foam. The pot is loudest before it boils. A phone can listen.

Nine alternatives, each attacking one term of Π, scored on the constraints below. **Ubaal, the phone, scores 85 and is the choice.** It costs ₹0, works on gas and induction, and we can test it. A bought milk-watcher disc plus the app scores 83 and is the backup, only after someone measures the disc.

The app is built. The kitchen test is not. In the model, an alarm at 88 °C leaves about 24 seconds, the person turns the flame down, and the foam stays under the rim. An alarm at 95 °C leaves about 8 seconds and the model still overflows. Both are models.

## Constraints (they are the weights)

| Constraint | Weight |
|---|---|
| Prevents an unattended boil-over | 30 |
| No one has to watch | 15 |
| Cost at or under ₹300 | 15 |
| A full boil is still reached | 10 |
| No change in taste | 10 |
| Easy to clean | 10 |
| Works on gas and on induction | 5 |
| The team can test it before the deadline | 5 |

Scope, from the submitted problem: 250–500 mL packaged milk, steel pot, gas or induction, at home. Out of scope: microwave, industrial plant, starchy liquids (rice water, dal).

Unattended means the tester is out of sight and moves only when the alarm sounds. Target: **0 boil-overs in 10 unattended trials.** That target is unmet because the trials were not run.

## Numbers a designer will be tempted to round

Use these, and keep the tag.

| Claim | Value | Tag |
|---|---|---|
| Kitchen trials | n = 0 | UNTESTED |
| Target | 0 / 10 unattended boil-overs | target, not a result |
| Steam vs water volume | 958 / 0.598 ≈ 1600 | source density, model use |
| Net heat into the pot | 1740 W × 68% ≈ 1183 W | IS 4246, model |
| Steam made at full flame | ≈ 0.88–0.9 L/s from ≈ 0.5 g/s of water | MODEL |
| Headspace, 14 cm pot, 500 mL | ≈ 1.04 L | MODEL geometry |
| Time to fill that headspace if no bubble bursts | ≈ 1.2 s | MODEL |
| Assumed bubble lifetime Σ | 0.6 + 4.0 = 4.6 s | ASSUMED, not fitted |
| Π at full flame, 14 cm | 3.9 | MODEL |
| Π full / low flame | 12 cm 6.4 / 1.3; 14 cm 3.9 / 0.78; 16 cm 2.7 / 0.54; 20 cm 1.5 / 0.31; 24 cm 1.0 / 0.20 | MODEL |
| Widest net power with Π < 1 | 305 W at 14 cm; 775 W at 20 cm | MODEL |
| Baseline: first boil, then overflow | 178 s, then 180 s. Gap **2.2 s** | MODEL |
| Ubaal cue at 88 °C, person takes 15 s | alarm 157 s, knob 172 s, boil 181 s, lead **24 s**, foam peaks near half the headroom, no overflow | MODEL |
| Same model, cue at 95 °C | lead ≈ 8 s, still overflows | MODEL |
| Auto low at 92 °C | boil about 26 s later than baseline, no overflow | MODEL |
| 20 cm pot, same flame | still overflows | MODEL |
| App + disc in the model | no overflow, but the disc cuts Σ by an assumed 0.45 | ASSUMED |
| Liquid swell, fridge to boil | ≈ 1.4 mm in this pot | estimate from water density |
| Detector, not retuned | 8 s calibration; band 150–1000 Hz; drop of 4 dB; peak held 5 s | software config |
| Synthetic logic tests | 3 of 3. The 21 s gap is the made-up sound, not a milk lead | LOGIC |
| Optional disc price | ₹295 on Amazon.in, seen 21 Nov 2026, may change | price check |
| Human response used in the model | 15 s | ASSUMED |

Scores, team judgements, not measurements: **F Ubaal 85 (chosen), H app + disc 83, B turn to sim before the boil 81, G automatic power cut 79, C disc alone 78, E silicone lid 70, A wider pot 69, I double-wall boiler 65, D spoon / stir / butter 64.** F stays first in 15 of 16 tests where each weight is moved by ±50%.

## Slide 1 — Problem, need, baseline, target

Kicker: `ID5060 · First Principles Tools · Term Project`  
Number: `01 / 06`

**Headline:** Milk boils over. The pot can say so first.

**Lede:** Milk sits calm for three minutes, then climbs over the rim in seconds. Every common fix needs someone standing at the stove. We rebuilt the problem from first principles. The fix is not a better pot. It is a phone that listens.

Three cards:

- **User need.** Get 250–500 mL of packaged milk to a full boil on a gas or induction stove at home, without watching the pot.
- **Baseline.** Kitchen: not recorded in this build (n = 0). Tag UNTESTED. Model, 14 cm pot: first boil to overflow ≈ 2.2 s. Tag MODEL. One sourced line under it: milk foams over; water at a full boil does not (New Scientist 2020; America’s Test Kitchen).
- **Target.** Big number **0 / 10**. Caption: boil-overs in 10 unattended trials.

Chips under the cards: full boil reached · no taste change · easy to clean · cost < ₹300.

Right side: a **diagram** of foam crossing a rim. Caption, mandatory: “Diagram of the failure, not a photograph.” Under it, the three names in the order above, with “(representative)” only on Vinay Chekuri.

Footer left: Scope: no microwave, no industrial processing, no starchy liquids. Footer right: AI use declared in the appendix.

**Notes.** Open on the moment everyone knows. Say n = 0 out loud. Say 2.2 seconds is a model. Point at the diagram and say it is not our photograph.

## Slide 2 — Deconstruct

Kicker: `Deconstruct · F.O.U.N.D · Ask what existed before`  
Number: `02 / 06`

**Headline:** The failure was never the milk. It was the sensor: a person staring at the pot.

Left, a chain:

Flame or coil (1.74 kW LPG, 64–68% into the pot) → milk heats (about 3 min from the fridge in the model; whey denatures above 70 °C) → skin forms → steam bubbles get a lifetime → foam over the rim (waste, cleaning, flame out).

Under it: the information loop today is eyes, brain, hand on the knob. It works only while someone watches. The visible warning is seconds before the spill.

Two figures, both captioned as not-our-video: an illustration of calm, then skin, then foam; and a model curve of foam versus time (MODEL).

A short history, only where we have a source:

- Watch it, low flame, stir, spoon across the pot
- 1938, milk-watcher disc, England (Collections WA)
- Milk boiler: water jacket and a whistle, Indian kitchens
- 2011, Panasonic patents, capacitive sensing on induction
- 2026, Samsung, LG, Cuckoo: sound and vibration cut the power (MK News)

Right, Five Whys:

1. It spilled because foam crossed the rim faster than anyone reacted.
2. So fast because about 0.9 L of steam a second enters about 1 L of headroom.
3. The steam stays as foam because denatured whey and casein coat the bubble. Water has no such film.
4. Nobody reacts in time because the visible cue is late. Watching is the only sensor.
5. Every fix assumes a person closes the loop. **Root cause: no early, non-visual signal reaches the user.**

Assumptions, as a small table:

| Familiar belief | What we found |
|---|---|
| The skin causes it | The skin raises bubble lifetime. Overflow still needs lifetime × steam rate > room. |
| Use a bigger pot | It delays the spill. Prevention at full flame needs about 24 cm in the model. |
| Someone must watch | The pot makes sound before it boils, so a phone can listen. |
| Low flame always works | Only if Π < 1 at the moment of boiling. Timing matters. |

**Notes.** Walk the chain left to right. Say the pictures are an illustration and a model. End on the root cause. The 1938 disc is a museum record. Guesses about why each product won are hypotheses, not facts.

## Slide 3 — Principles and transformers

Kicker: `Analyze · Governing principles · Transformers`  
Number: `03 / 06`

**Headline:** One number decides boil-over. Four transformers showed us how to move it.

Principles, numbered:

1. Phase change magnifies volume. ρ_liquid / ρ_steam = 958 / 0.598 ≈ 1600.
2. Energy is conserved. At the boil, extra watts become steam.
3. Surface films give bubbles a lifetime. Pure water has none.
4. Whey proteins denature above 70–75 °C and make the skin with the fat.
5. Steady foam height H_e = Σ · U_g (Bikerman).

Then the equation, large, on an accent card:

**Π = Σ · Qᵥ / V_free**

Bubble lifetime × steam rate ÷ room to grow. **Π > 1 means boil-over.** Qᵥ = P / (ρᵥ h_fg). With the assumed Σ, Π ≈ 3.9 at full flame in a 14 cm pot. MODEL.

Four transformer cards. Each one needs an insight and a rebuild, not a definition alone.

1. **Magnify.** About 0.9 L of steam a second from half a gram of water. A 1 L headspace fills in about 1.2 s if nothing bursts. Rebuild: the warning has to come before the boil.
2. **Scale.** Π falls as P / D². A wider pot delays the spill. Cutting power moves Π more, and costs nothing. Show the Π-versus-diameter chart and stamp it MODEL.
3. **Approach a limit.** t\* = −τ ln(1 − 1/Π) goes to infinity as Π approaches 1 from above. Arrive just under 1. You do not need zero heat.
4. **Change frame.** The pivot, so give it the accent border. Success means lead time longer than response plus burner lag. Kettle sound peaks at 60–70 °C and is much quieter by 95 °C. That is water, not yet our milk. Swap the eye for a microphone.

Footer: Engineering ToolBox, Pugh 2016, Singh 2007, New Scientist 2020, Annals of FEH 2014. And the line “MODEL = estimate from equations, not measured.”

**Notes.** Name Buckingham π. Say Σ = 4.6 s is assumed (0.6 + 4.0) and not fitted. Magnify is why it is sudden. Scale is why a bigger pot half-works. The limit is why “just under 1” is enough. Change frame is the decision.

## Slide 4 — Alternatives and the choice

Kicker: `Reconstruct · alternatives · weighted comparison`  
Number: `04 / 06`

**Headline:** Nine ways to move Π. We chose the one that needs no new hardware.

Table. Columns: alternative, which term of Π, which transformer, score.

| Alternative | Term | Transformer | Score |
|---|---|---|---|
| F · Ubaal, the phone | Qᵥ, timed | Change frame | **85, chosen** |
| H · Ubaal plus a disc, ₹295 | Σ and Qᵥ | Change frame + perturb | 83 |
| B · Heat-flux rule: sim before the boil | Qᵥ | Approach a limit | 81 |
| G · Auto power cut | Qᵥ | Change frame | 79 |
| C · Milk-watcher disc alone | Σ | Perturb | 78 |
| E · Silicone flower lid (€34.95) | V_free | Scale | 70 |
| A · Wider pot | V_free | Scale | 69 |
| I · Double-walled milk boiler | Qᵥ | Change frame | 65 |
| D · Spoon, stirring, butter | Σ | Perturb | 64 |

Under the table, the weights in one line, and: scores are team judgements. F stays first in 15 of 16 weight shifts of ±50%.

Right side, the reconstruction, five steps:

1. Phone 30–50 cm from the pot. Learns room noise for 8 s.
2. Hiss rises. Bubbles collapse in subcooled milk, 150–1000 Hz.
3. **PRE-BOIL.** Hiss peaks, then fades by 4 dB. Alarm: turn to sim.
4. Turn down. Qᵥ falls, so Π < 1 at the boil.
5. Full boil. Deep bubbling. No spill.

One chart: earlier cue, more time to respond. Stamp MODEL. One annotated sketch of a phone beside a pot. Caption it as a sketch.

**Why it should work,** in one paragraph: in the model the alarm is in the subcooled phase, 24 s before the boil. That clears the assumed 15 s response. Turning down drops Π below 1. A 95 °C cue does not. Both times are model estimates.

Do not add Rimclip to this table as a tenth row unless you also show a score, and do not invent a score that pretends it was in the original matrix. If you mention it, one footnote: a falling clip is late; the drawn surface clip is untested; Ubaal stays the choice. The full drawing belongs in the appendix or as a small figure on slide 6, not as a new winner.

**Notes.** Every row attacks one term of the same equation. Read the weights. F wins because it costs nothing, works on both stoves, and we can test it by the deadline. H is the backup only if a real lead time is too short and the disc’s effect is measured.

## Slide 5 — What was built

Kicker: `Evaluate · build · test · refine`  
Number: `05 / 06`

**Headline:** Built and modelled. The kitchen test is still open.

Left, what exists:

- **Ubaal**, a phone page: microphone, a state machine, a spoken alarm in English or Hindi, buttons to mark what the cook saw, export of a log.
- A simulator of the same equations, with a banner that the curves are estimates.
- Define unattended in one line. Planned sample: at least 3 baseline and 5 with the app. **Run so far: n = 0.**

Right, the before/after chart. Red baseline crosses the rim. Green Ubaal stays near half the headroom. Caption: MODEL, not a kitchen before/after. Baseline overflow at 180 s, 2.2 s after first boil. Ubaal lead 24 s.

Under that, three facts in a row:

- Logic tests on synthetic audio: 3 of 3. A hiss gives PRE-BOIL then BOILING. A scripted rattle gives BOILING. Steady noise gives no alarm. **LOGIC, not milk.**
- Refinement: we kept the starting config, because there is no labelled recording. Drop 4 dB, peak held 5 s, calibration 8 s. Tuning on a made-up sound would fake a refinement.
- Next change: one noise-only recording and one boil, then search those two knobs for the longest lead with zero false alarms.

**Notes.** Show the two things we built. Say n = 0. Do not call 3 of 3 a milk result. The honesty is the refinement: we did not retune.

## Slide 6 — Benefits, cost, limits, next

Kicker: `Benefits · cost · trade-offs · limits · next`  
Number: `06 / 06`

**Headline:** What changed, what it cost, and what we still don't know.

Three big numbers:

- Boil-overs, unattended: **n = 0**. Target stays 0/10. UNTESTED.
- Warning before boil: **24 s**. Only if the cue is at 88 °C and the turn-down takes 15 s. MODEL.
- Cost: **₹0** for the app, plus ₹295 for an optional disc seen on 21 Nov 2026. Under ₹300.

Trade-offs:

- Turning down at 92 °C delays the boil by about 26 s in the model. Ubaal’s later cue delays it by about 3 s.
- The phone has to sit near the stove, microphone uncovered.
- On gas, a person still turns the knob. The app replaces watching, not acting.
- False alarms from a pressure-cooker whistle, a fan, or a second pot are possible and unmeasured.

Limits:

- No unattended milk trials. One assumed pot.
- Π, Σ, and every curve are estimates. Σ = 4.6 s was not fitted.
- Synthetic audio proves the state machine, not the sound of milk.
- A clip that falls only when the foam is up is too late (about 2 s in the model). A disc that stays in the surface, with a tapping head, is drawn and untested. Ubaal stays the choice.

Next step, in an accent card: on induction, cut the power at PRE-BOIL so no one has to be in the room. Then train a small on-device classifier on our own labelled recordings.

References, short, on the slide (full URLs live in `01_RESEARCH/REFERENCES.md`, R1–R40):

1. Muir, “Why does milk spill over when it boils?”, New Scientist, 30 Sep 2020.
2. America’s Test Kitchen, “Preventing dairy from boiling over.”
3. Pugh, *Bubble and Foam Chemistry*, Cambridge, 2016, chapter 11.
4. Singh, Lait 87 (2007) 413–423.
5. Kamath, Webb and Deeth, Journal of Dairy Science, 2011.
6. Kreiner, “Der Teller in der Milch”, University of Ulm, 2015.
7. Ondrejčák and Lumnitzer, Annals of Faculty of Engineering Hunedoara, 2014 (kettle sound).
8. Panasonic US 9,462,639 and US 9,386,635; MK News, 12 Mar 2026.
9. BIS IS 4246:2002; Engineering ToolBox steam tables.

Footer: references, calculations and contributions are in the appendix. Kitchen rows are not in it yet.

**Notes.** Lead with the hole. Do not call 24 seconds a measured lead. If someone asks about a mechanical clip, use the Rimclip section below. Close on recording the trials, then cutting power on induction.

## The rim clip, if you show it

File to place, small: `10_RIMCLIP/rimclip_drawing.svg` or the render `10_RIMCLIP/rimclip_preview.png`. Suggested spot: a corner of slide 6, or not on the slides at all. The appendix already explains it.

**Caption you must use:** “Drawn, not built. A latch that falls when the foam arrives is too late. This disc sits in the surface the whole time. The loose head taps the pot if the bubbles shake it. Untested. Ubaal remains the choice.”

What the object is:

- A stainless jaw on the rim (slot 2.6 mm). The arm hangs inside the pot, away from the flame.
- Drop of the wire centre about 67 mm, for 500 mL in a 14 cm pot.
- A 40 mm disc, 1.2 mm thick, six notches, on a captive 2.2 mm pin, lying in the milk.
- A loose striker on that pin, a couple of millimetres short of a tab. When the surface shakes, the head taps. That tap is the noise.
- Material: SS304 wire, 2.5–3 mm, and a stainless disc. **No plastic.** A gas flame will melt it.

What you must not draw:

- Do not show the disc falling off as the foam rises. That version loses.
- Do not show a big drop of the milk level “from expansion.” The rise is about 1.4 mm.
- Do not show a green “works” tick, a before/after photo, or a decibel number. None of those exist.
- Do not put it above Ubaal in the comparison.

CAD, for anyone who wants to open the part rather than the slide: `10_RIMCLIP/rimclip.scad` and `10_RIMCLIP/rimclip.stl`. The mesh is the assembled pose. It was drafted with Cursor and Grok and is declared as such.

## Who did what (appendix, not a slide)

| Member | What is actually in the build |
|---|---|
| Vinnay Gupta ED22B073 | Framing, the Π write-up, the alternatives, the deck, the appendix, the Rimclip design |
| Vinay Chekuri EE22B026 (representative) | The Ubaal detector: signal path, state machine, Hindi and English alarms, packaging, logic tests |
| Atharva Chinchalkar BS22B010 | The milk-foam science and the trial protocol. The foam-decay fit is still waiting on a video |
| All | Five Whys, the choice of the phone, and the decision not to present a model as a measurement |

AI: Cursor and Grok drafted the literature summary, the dimensional analysis, the simulator, the app, the analysis scripts, the slides, the appendix, and the Rimclip model. No kitchen observation was generated. The person who submits still has to open any source they are unsure of.

## Files if you want the existing art instead of redrawing

All paths are under `Team_Overflow_ID5060_Cursor_Pack/`.

- Diagram of the failure: `05_DECK/deck/assets/diagram_boilover.svg`
- Sequence illustration: `05_DECK/deck/assets/diagram_sequence.svg`
- Phone sketch: `05_DECK/deck/assets/sketch_ubaal.svg`
- Charts, all stamped MODEL: `05_DECK/deck/assets/figures/`
- A deck that already follows this brief: `05_DECK/deck/index.html` and `05_DECK/export/`
- Rimclip: `10_RIMCLIP/`
