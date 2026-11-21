# Refinement record · Ubaal v1 kept

## What v1 is
`DEFAULT_CFG` in `app/core.js`: calibrate 8 s, hiss band 150–1000 Hz, PRE-BOIL when the slow hiss falls `dropDb = 4` below a peak that has been held for `minPeakHoldS = 5`. These are starting guesses from kettle literature, not a fit.

## Why nothing was changed
The search in the project prompt (dropDb in {2, 3, 4, 5}, minPeakHoldS in {2, 3, 5}, longest median lead with zero false alarms) needs a noise-only kitchen recording and the v1 boil recordings. Neither file exists. Searching those knobs on the synthetic clips, and then calling the winner a refinement, would dress a made-up signal up as a milk result. v1 is unchanged. v2 data was not touched because there is no v2 data.

## What the synthetic tests do say
`npm test` in this folder: 3 of 3.

- A hiss that rises and fades, then deeper bubbling, produces PRE-BOIL and then BOILING.
- A scripted disc rattle produces BOILING.
- Steady noise produces no alarm.

That is a logic check. It is not a false-alarm rate and not a lead time.

## Next change, once a recording exists
Replay the noise-only file and the v1 boils with `tools/replay.mjs`. Keep the setting with the longest median lead and zero alarms on the noise-only file. Write that `cfg.json` here, put the same numbers into `app.js`, and only then collect v2.
