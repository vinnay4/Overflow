// Logic test of the detector on SYNTHETIC audio. This proves the code paths work; it says NOTHING
// about real milk. Real validation = labelled recordings from your own kitchen (TEST_PLAN.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import { BoilDetector, powerSpectrum } from "../app/core.js";

const SR = 16000, N = 1024;
function rng(seed) { let s = seed >>> 0; return () => ((s = (1664525 * s + 1013904223) >>> 0) / 2 ** 32) * 2 - 1; }
function biquadBP(f0, Q) {
  const w = 2 * Math.PI * f0 / SR, al = Math.sin(w) / (2 * Q), a0 = 1 + al;
  const b0 = al / a0, b2 = -al / a0, a1 = -2 * Math.cos(w) / a0, a2 = (1 - al) / a0;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return (x) => { const y = b0 * x + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = x; y2 = y1; y1 = y; return y; };
}
function synth({ seconds = 200, hiss = true, boil = true, rattle = false, fan = 0 }) {
  const r = rng(7), bp = biquadBP(450, 0.6), x = new Float32Array(seconds * SR);
  let blub = [];
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    let v = 0.002 * r() + fan * r();
    if (hiss && t > 12) {
      const env = t < 90 ? (t - 12) / 78 : Math.max(0.15, 1 - (t - 90) / 55);
      v += 0.08 * env * bp(r());
    }
    if (boil && t > 135) {
      if (r() > 1 - 4 / SR) blub.push({ t0: t, f: 60 + 60 * Math.abs(r()), a: 0.15 });
      blub = blub.filter(b => t - b.t0 < 0.25);
      for (const b of blub) v += b.a * Math.exp(-(t - b.t0) * 18) * Math.sin(2 * Math.PI * b.f * (t - b.t0));
    }
    if (rattle && t > 138 && (i % Math.round(SR / 3)) < 40) v += 0.3 * r();
    x[i] = v;
  }
  return x;
}
function run(x) {
  const d = new BoilDetector(SR, N, N / SR);
  for (let i = 0; i + N <= x.length; i += N) d.push(powerSpectrum(x.subarray(i, i + N)));
  return d.events;
}

test("hiss rises, peaks, fades, then deep bubbling → PRE_BOIL before BOILING", () => {
  const ev = run(synth({}));
  const pre = ev.find(e => e.type === "PRE_BOIL"), boil = ev.find(e => e.type === "BOILING");
  console.log("events:", ev);
  assert.ok(pre, "PRE_BOIL fired"); assert.ok(boil, "BOILING fired");
  assert.ok(pre.t > 90 && pre.t < 135, `PRE_BOIL at ${pre.t}s should follow the hiss peak (90 s)`);
  assert.ok(boil.t >= 135, `BOILING at ${boil.t}s should not precede synthetic boil onset (135 s)`);
});

test("disc rattle triggers BOILING", () => {
  const ev = run(synth({ boil: false, rattle: true }));
  const boil = ev.find(e => e.type === "BOILING");
  console.log("events:", ev);
  assert.ok(boil && boil.t >= 138, "rattle detected after it starts");
});

test("steady background noise only → no alarm (no false positive)", () => {
  const ev = run(synth({ hiss: false, boil: false, fan: 0.01 }));
  assert.equal(ev.filter(e => e.type !== "LISTENING").length, 0);
});
