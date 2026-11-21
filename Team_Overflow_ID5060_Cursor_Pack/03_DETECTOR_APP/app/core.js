/**
 * core.js — Ubaal boil detector core (pure JS, runs in the browser AND in Node for tests).
 *
 * Input : one magnitude spectrum per frame (linear power or dB), with sampleRate and fftSize.
 * Output: features per frame + state-machine events (CALIBRATING → LISTENING → PRE_BOIL → BOILING).
 *
 * Physics behind the cues (see 03_DETECTOR_APP/ALGORITHM.md for sources):
 *  - Subcooled boiling: vapour bubbles collapse in cooler liquid → broadband noise ~100 Hz–1 kHz
 *    (nuclear-power.com; MIT thesis "Acoustic boiling detection"). This is loudest well BEFORE the boil.
 *    In an electric kettle it peaked at 60–70 °C and fell by >10 dB(A) by ~95 °C (Annals FEH 2014).
 *  - Near saturation the "singing" gives way to deeper bubbling (low-frequency content).
 *  - A milk-watcher disc rattles: periodic broadband clicks (high spectral flux).
 * ALL THRESHOLDS BELOW ARE STARTING GUESSES — TUNE THEM ON YOUR OWN LABELLED RECORDINGS.
 */
export const DEFAULT_CFG = {
  calibrateS: 8,          // seconds of ambient noise to learn the floor (start BEFORE lighting the stove)
  subBand: [150, 1000],   // Hz subcooled-collapse band
  lowBand: [40, 150],     // Hz deep bubbling band
  hiBand: [2000, 6000],   // Hz clicks / rattle band
  emaFastS: 1.0,
  emaSlowS: 5.0,
  armDb: 6,               // sub-band must rise this far above floor before a peak counts
  dropDb: 4,              // PRE_BOIL when slow sub-band level falls this far below its running peak
  minPeakHoldS: 5,        // ... and the peak is at least this old
  boilLowRiseDb: 6,       // BOILING needs the low band this far above its floor ...
  boilTiltDb: 6,          // ... AND the spectrum tilted toward low tones by this much vs. the hiss peak
  rattleRateHz: 1.5,      // disc rattle: onset rate in hi band (events / s)
  rattleSustainS: 3,
  onsetK: 2.5,            // onset when hi-band flux > mean + k*std (rolling)
};

/** radix-2 FFT power spectrum for offline/Node use. x.length must be a power of 2. */
export function powerSpectrum(x) {
  const n = x.length, re = new Float64Array(n), im = new Float64Array(n);
  for (let i = 0; i < n; i++) re[i] = x[i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1))); // Hann
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const ur = re[i + k], ui = im[i + k];
        const vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci;
        const vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
        re[i + k] = ur + vr; im[i + k] = ui + vi;
        re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
        const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
      }
    }
  }
  const out = new Float64Array(n / 2);
  for (let i = 0; i < n / 2; i++) out[i] = (re[i] * re[i] + im[i] * im[i]) / n;
  return out;
}

const db = (p) => 10 * Math.log10(Math.max(p, 1e-12));

export class BoilDetector {
  constructor(sampleRate, fftSize, frameIntervalS, cfg = {}) {
    this.cfg = { ...DEFAULT_CFG, ...cfg };
    this.sr = sampleRate; this.n = fftSize; this.dt = frameIntervalS;
    this.t = 0; this.state = "CALIBRATING"; this.events = [];
    this.calib = { sub: [], low: [], hi: [] };
    this.floor = null;
    this.emaSubF = null; this.emaSubS = null; this.emaLow = null;
    this.peak = -Infinity; this.peakT = 0; this.armed = false; this.tiltAtPeak = 0;
    this.prevHi = null; this.fluxHist = []; this.onsets = [];
    this.rattleSince = null;
  }
  bandPower(spec, [lo, hi], isDb) {
    const binHz = this.sr / this.n;
    const a = Math.max(1, Math.floor(lo / binHz)), b = Math.min(spec.length - 1, Math.ceil(hi / binHz));
    let s = 0;
    for (let i = a; i <= b; i++) s += isDb ? 10 ** (spec[i] / 10) : spec[i];
    return s / (b - a + 1);
  }
  ema(prev, x, tauS) { const a = Math.min(1, this.dt / tauS); return prev === null ? x : prev + a * (x - prev); }
  emit(type, msg) { const e = { t: +this.t.toFixed(2), type, msg }; this.events.push(e); return e; }

  /** push one spectrum frame; returns {features, event|null} */
  push(spec, isDb = false) {
    const c = this.cfg;
    const sub = db(this.bandPower(spec, c.subBand, isDb));
    const low = db(this.bandPower(spec, c.lowBand, isDb));
    const binHz = this.sr / this.n;
    // hi-band spectral flux (positive differences, in dB)
    const a = Math.floor(c.hiBand[0] / binHz), b = Math.min(spec.length - 1, Math.ceil(c.hiBand[1] / binHz));
    const hiNow = [];
    for (let i = a; i <= b; i++) hiNow.push(isDb ? spec[i] : db(spec[i]));
    let flux = 0;
    if (this.prevHi) for (let i = 0; i < hiNow.length; i++) { const d = hiNow[i] - this.prevHi[i]; if (d > 0) flux += d; }
    this.prevHi = hiNow;
    flux /= Math.max(1, hiNow.length);
    let event = null;
    this.emaSubF = this.ema(this.emaSubF, sub, c.emaFastS);
    this.emaSubS = this.ema(this.emaSubS, sub, c.emaSlowS);
    this.emaLow = this.ema(this.emaLow, low, c.emaSlowS);
    // onset detection on flux
    this.fluxHist.push(flux); if (this.fluxHist.length > Math.round(10 / this.dt)) this.fluxHist.shift();
    const m = this.fluxHist.reduce((s, v) => s + v, 0) / this.fluxHist.length;
    const sd = Math.sqrt(this.fluxHist.reduce((s, v) => s + (v - m) ** 2, 0) / this.fluxHist.length) || 1e-6;
    if (flux > m + c.onsetK * sd && flux > 1.0) this.onsets.push(this.t);
    while (this.onsets.length && this.onsets[0] < this.t - c.rattleSustainS) this.onsets.shift();
    const onsetRate = this.onsets.length / c.rattleSustainS;

    if (this.state === "CALIBRATING") {
      this.calib.sub.push(sub); this.calib.low.push(low);
      if (this.t >= c.calibrateS) {
        const med = (arr) => [...arr].sort((x, y) => x - y)[Math.floor(arr.length / 2)];
        this.floor = { sub: med(this.calib.sub), low: med(this.calib.low) };
        this.state = "LISTENING";
        event = this.emit("LISTENING", `Noise floor learned (sub ${this.floor.sub.toFixed(1)} dB, low ${this.floor.low.toFixed(1)} dB)`);
      }
    } else {
      const subAbove = this.emaSubS - this.floor.sub;
      if (subAbove > c.armDb) this.armed = true;
      if (this.armed && this.emaSubS > this.peak) { this.peak = this.emaSubS; this.peakT = this.t; this.tiltAtPeak = this.emaLow - this.emaSubS; }
      const tilt = this.emaLow - this.emaSubS;
      if (this.state === "LISTENING") {
        if (this.armed && this.peak - this.emaSubS >= c.dropDb && this.t - this.peakT >= c.minPeakHoldS) {
          this.state = "PRE_BOIL";
          event = this.emit("PRE_BOIL", "Pre-boil signature: the hiss peaked and is fading. Turn the flame to SIM now.");
        }
      }
      if (this.state !== "BOILING") {
        if (onsetRate >= c.rattleRateHz) {
          if (this.rattleSince === null) this.rattleSince = this.t;
          if (this.t - this.rattleSince >= c.rattleSustainS * 0.5) {
            this.state = "BOILING";
            event = this.emit("BOILING", "Disc is rattling: milk is at the boil. Turn the flame down NOW.");
          }
        } else this.rattleSince = null;
        if (this.state !== "BOILING" && this.armed && this.emaLow - this.floor.low >= c.boilLowRiseDb && tilt - this.tiltAtPeak >= c.boilTiltDb) {
          this.state = "BOILING";
          event = this.emit("BOILING", "Deep bubbling detected: milk is at the boil. Turn the flame down NOW.");
        }
      }
    }
    const features = { t: +this.t.toFixed(2), sub, low, flux, tilt: this.emaLow - this.emaSubS, emaSubS: this.emaSubS, emaLow: this.emaLow, onsetRate, state: this.state };
    this.t += this.dt;
    return { features, event };
  }
}
