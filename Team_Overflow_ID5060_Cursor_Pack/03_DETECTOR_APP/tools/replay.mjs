// Replay a WAV recording through the same detector the phone runs, and write events + features CSV.
// Usage: node tools/replay.mjs path/to/trial.wav [configOverrides.json]
// Convert phone .webm first:  ffmpeg -i T07_audio.webm -ac 1 -ar 16000 T07.wav
import fs from "node:fs";
import { BoilDetector, powerSpectrum } from "../app/core.js";

export function readWav(buf) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  let p = 12, fmt = null, data = null;
  while (p < buf.length - 8) {
    const id = buf.toString("ascii", p, p + 4), size = dv.getUint32(p + 4, true);
    if (id === "fmt ") fmt = { ch: dv.getUint16(p + 10, true), sr: dv.getUint32(p + 12, true), bits: dv.getUint16(p + 22, true) };
    if (id === "data") data = { off: p + 8, size };
    p += 8 + size + (size % 2);
  }
  if (!fmt || !data || fmt.bits !== 16) throw new Error("Need 16-bit PCM WAV");
  const n = data.size / 2 / fmt.ch, x = new Float32Array(n);
  for (let i = 0; i < n; i++) { let s = 0; for (let c = 0; c < fmt.ch; c++) s += dv.getInt16(data.off + 2 * (i * fmt.ch + c), true); x[i] = s / fmt.ch / 32768; }
  return { sr: fmt.sr, x };
}
export function replay(x, sr, cfg = {}) {
  const N = sr >= 32000 ? 4096 : 1024;
  const hop = Math.round(sr * 0.1);
  const d = new BoilDetector(sr, N, hop / sr, cfg);
  const feats = [];
  for (let i = 0; i + N <= x.length; i += hop) feats.push(d.push(powerSpectrum(x.subarray(i, i + N))).features);
  return { events: d.events, feats };
}
if (process.argv[1] && process.argv[1].endsWith("replay.mjs")) {
  const f = process.argv[2];
  if (!f) { console.error("usage: node tools/replay.mjs file.wav [cfg.json]"); process.exit(1); }
  const cfg = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], "utf8")) : {};
  const { sr, x } = readWav(fs.readFileSync(f));
  const { events, feats } = replay(x, sr, cfg);
  const base = f.replace(/\.wav$/i, "");
  fs.writeFileSync(base + "_replay_events.csv", "t,type,msg\n" + events.map(e => `${e.t},${e.type},"${e.msg}"`).join("\n"));
  const keys = Object.keys(feats[0]);
  fs.writeFileSync(base + "_replay_features.csv", keys.join(",") + "\n" + feats.map(r => keys.map(k => r[k]).join(",")).join("\n"));
  console.log(JSON.stringify(events, null, 1));
}
