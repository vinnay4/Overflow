# Demo video

The file `Ubaal_demo.mp4` (1 min 11 s, 1600×900, captions, no audio) is a screen recording of the deck, the model, and the Ubaal test alarm. It is not a milk boil. Re-record with `node record_demo.mjs` while `python3 -m http.server 8765` is running in this pack.

Original storyboard, for a later cut once kitchen footage exists:

# Demo video: ≤ 2:00 (target 1:50). Vertical or 16:9; captions burned in; no music needed

| Time | Visual | Voice-over / caption |
|---|---|---|
| 0:00–0:08 | S1: milk foaming over the rim (real) | "Every Indian kitchen knows this moment." |
| 0:08–0:20 | Baseline timeline: calm for ~3 min → over the rim in __ s (timer on screen) | "Calm for three minutes, over the rim in __ seconds. Our baseline: __ of __ unattended boils spilled." |
| 0:20–0:38 | Simulator: steam ×1600 animation, Π slider crossing 1 | "Physics: water turns into 1600 times its volume as steam. Milk proteins make the bubbles last. One number, Π, decides it. Above 1, it spills. *Model estimate.*" |
| 0:38–0:50 | Caption: "The real problem: the only sensor is a person staring at the pot" | "So we changed the frame. Don't make the milk behave. Make the pot tell you." |
| 0:50–1:15 | S6/S7: Ubaal on the phone, spectrum moving; tester in the next room; alarm "turn the flame to sim"; walks in, turns the knob | "Before milk boils, it hisses. The hiss peaks and then fades. Ubaal hears that and warns you about __ seconds early." |
| 1:15–1:30 | S8: full rolling boil, foam below the rim | "Full boil. No spill. Nobody watching." |
| 1:30–1:45 | Before/after bar: __/__ → __/__ ; refinement caption | "Baseline __ of __ spilled; with Ubaal __ of __. After v1 we changed __, which gave __." |
| 1:45–1:55 | Limitations card | "Small sample, one kitchen. Model numbers are estimates. Next: cut the power automatically on induction." |
| 1:55–2:00 | Title card: Ubaal · Team Overflow · names + roll numbers | "Listen, don't watch." |

**Recording tips:** use the phone's own screen recorder for the app; keep each clip < 10 s; edit in CapCut/Clipchamp; export 1080p, < 50 MB. Never show synthetic/example data as a real result. If no milk trials happened, cut the 1:15–1:45 shots and say so.
