// Writes SYNTHETIC_demo_boil.wav — an artificial signal for checking the pipeline end to end.
// It is NOT a recording of milk and must never be presented as data.
import fs from "node:fs";
const SR = 16000, sec = 200, x = new Int16Array(SR * sec);
let s = 12345; const r = () => ((s = (1664525 * s + 1013904223) >>> 0) / 2 ** 32) * 2 - 1;
const w = 2 * Math.PI * 450 / SR, al = Math.sin(w) / 1.2, a0 = 1 + al, b0 = al / a0, b2 = -al / a0, a1 = -2 * Math.cos(w) / a0, a2 = (1 - al) / a0;
let x1 = 0, x2 = 0, y1 = 0, y2 = 0, blub = [];
for (let i = 0; i < x.length; i++) {
  const t = i / SR; let v = 0.002 * r();
  if (t > 12) { const n = r(); const y = b0 * n + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = n; y2 = y1; y1 = y; v += 0.08 * (t < 90 ? (t - 12) / 78 : Math.max(0.15, 1 - (t - 90) / 55)) * y; }
  if (t > 135) { if (r() > 1 - 4 / SR) blub.push({ t0: t, f: 60 + 60 * Math.abs(r()) }); blub = blub.filter(b => t - b.t0 < 0.25); for (const b of blub) v += 0.15 * Math.exp(-(t - b.t0) * 18) * Math.sin(2 * Math.PI * b.f * (t - b.t0)); }
  x[i] = Math.max(-32767, Math.min(32767, v * 32767));
}
const hdr = Buffer.alloc(44); hdr.write("RIFF", 0); hdr.writeUInt32LE(36 + x.byteLength, 4); hdr.write("WAVEfmt ", 8);
hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(1, 22); hdr.writeUInt32LE(SR, 24); hdr.writeUInt32LE(SR * 2, 28); hdr.writeUInt16LE(2, 32); hdr.writeUInt16LE(16, 34);
hdr.write("data", 36); hdr.writeUInt32LE(x.byteLength, 40);
fs.writeFileSync(process.argv[2] || "SYNTHETIC_demo_boil.wav", Buffer.concat([hdr, Buffer.from(x.buffer)]));
console.log("wrote SYNTHETIC wav");
