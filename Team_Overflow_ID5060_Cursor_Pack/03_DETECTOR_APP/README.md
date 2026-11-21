# 03_DETECTOR_APP: **Ubaal** (उबाल), "listen, don't watch"

A phone web app (PWA, plain JS, no build, no server, no account). It listens to the pot through the microphone and alerts **before** the milk boils:
- **PRE_BOIL** → beep ×3, vibration and voice: *"Milk is about to boil. Turn the flame to sim."*
- **BOILING** (backup) → urgent alarm: *"Milk is boiling. Turn the flame down now."*

It also works as the team's **data-logging instrument**. One tap per event (Stove on, First bubble, Foam rising, Knob down, Overflow!, Full boil held). On Stop it downloads `<trial>_features.csv`, `<trial>_events.csv`, `<trial>_labels.csv` and `<trial>_audio.webm`. These are the raw evidence for the appendix.

## Run it on a phone (5 minutes)
The microphone needs **https or localhost**. Options:
1. **Laptop + phone on the same Wi-Fi (fastest):** `npm run serve` (port 5173). Then on the laptop run `npx --yes localtunnel --port 5173` or use `ngrok http 5173` and open the https URL on the phone.
2. **GitHub Pages (best for the demo and the video):** push `app/` to a repo and enable Pages. You get a permanent https URL, and the PWA can be "Added to Home screen".
3. **Laptop only:** open http://localhost:5173 in Chrome and put the laptop ~50 cm from the stove.

**Use:** set Stove, Trial ID and Disc. Press **Start listening** *before* lighting the stove (8 s calibration of kitchen noise), then light the stove and walk away. Keep the screen on (the app requests a wake lock). Put the phone 30–60 cm from the pot, away from steam.

## Test (verified 21 Nov 2026, IST)
```bash
npm test                                   # 3/3 synthetic tests: PRE_BOIL before BOILING; disc rattle → BOILING; steady noise → no alarm
node tools/make_synthetic_wav.mjs /tmp/s.wav && node tools/replay.mjs /tmp/s.wav   # WAV → events + features CSV
```
To replay a real trial: `ffmpeg -i T07_audio.webm -ac 1 -ar 16000 T07.wav && node tools/replay.mjs T07.wav [cfg.json]`.

> The synthetic tests prove the **logic** works on made-up signals. They do **not** prove it works on milk. Only labelled kitchen recordings can (see `TEST_PLAN.md`). The thresholds in `DEFAULT_CFG` are starting guesses.

Docs: `SPEC.md` · `ALGORITHM.md` · `TEST_PLAN.md` · `SPEC.md (camera section)` (optional second sensor).
