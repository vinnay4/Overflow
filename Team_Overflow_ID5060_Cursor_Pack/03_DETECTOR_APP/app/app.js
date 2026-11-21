import { BoilDetector } from "./core.js";
import { alertCopy, alertLang } from "./alerts.js";

const $ = (s) => document.querySelector(s);
let ctx, analyser, src, stream, rec, chunks = [], det, timer, t0, wakeLock;
const featRows = [], labelRows = [], eventRows = [];
const levelHist = [];

function beep(times = 3, freq = 1046) {
  const a = new AudioContext();
  for (let i = 0; i < times; i++) {
    const o = a.createOscillator(), g = a.createGain();
    o.frequency.value = freq; o.connect(g); g.connect(a.destination);
    g.gain.setValueAtTime(0.0001, a.currentTime + i * 0.35);
    g.gain.exponentialRampToValueAtTime(0.6, a.currentTime + i * 0.35 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + i * 0.35 + 0.3);
    o.start(a.currentTime + i * 0.35); o.stop(a.currentTime + i * 0.35 + 0.32);
  }
}
function alertUser(ev) {
  const urgent = ev.type === "BOILING";
  beep(urgent ? 6 : 3, urgent ? 1318 : 988);
  navigator.vibrate?.(urgent ? [400, 150, 400, 150, 400] : [250, 100, 250]);
  if ($("#speak").checked && "speechSynthesis" in window) {
    const hindi = $("#hindi").checked;
    const u = new SpeechSynthesisUtterance(alertCopy(urgent, hindi));
    u.lang = alertLang(hindi);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }
  if ("Notification" in window && Notification.permission === "granted") new Notification("Ubaal", { body: ev.msg });
}
function setState(s, msg) {
  const ring = $("#ring"); ring.className = "ring " + s;
  $("#state").textContent = { CALIBRATING: "Learning room noise", LISTENING: "Listening", PRE_BOIL: "Turn to SIM", BOILING: "BOILING" }[s] || s;
  if (msg) $("#msg").textContent = msg;
}
function logEvent(e) {
  eventRows.push(e);
  const li = document.createElement("li"); li.textContent = `${e.t.toFixed(1)} s · ${e.type} · ${e.msg}`; $("#events").appendChild(li);
}
async function start() {
  stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
  ctx = new AudioContext();
  src = ctx.createMediaStreamSource(stream);
  analyser = ctx.createAnalyser(); analyser.fftSize = 4096; analyser.smoothingTimeConstant = 0;
  src.connect(analyser);
  const frameS = 0.1;
  det = new BoilDetector(ctx.sampleRate, analyser.fftSize, frameS, { /* tuned config goes here */ });
  const spec = new Float32Array(analyser.frequencyBinCount);
  rec = new MediaRecorder(stream); chunks = []; rec.ondataavailable = (e) => chunks.push(e.data); rec.start(1000);
  try { wakeLock = await navigator.wakeLock?.request("screen"); } catch {}
  if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
  t0 = performance.now();
  setState("CALIBRATING", "Stay quiet for 8 s while Ubaal learns the room. Then light the stove.");
  timer = setInterval(() => {
    analyser.getFloatFrequencyData(spec);
    const { features, event } = det.push(spec, true);
    featRows.push(features);
    levelHist.push(features); if (levelHist.length > 600) levelHist.shift();
    if (event) { logEvent(event); setState(det.state, event.msg); if (event.type !== "LISTENING") alertUser(event); }
    const el = (performance.now() - t0) / 1000;
    $("#clock").textContent = `${String(Math.floor(el / 60)).padStart(2, "0")}:${String(Math.floor(el % 60)).padStart(2, "0")}`;
    drawSpec(spec); drawLevels();
  }, frameS * 1000);
  $("#start").disabled = true; $("#stop").disabled = false;
}
function drawSpec(spec) {
  const c = $("#spec"), g = c.getContext("2d"); const w = c.width = c.clientWidth, h = c.height;
  const img = g.getImageData(1, 0, w - 1, h); g.putImageData(img, 0, 0);
  const binHz = ctx.sampleRate / analyser.fftSize, maxHz = 4000;
  for (let y = 0; y < h; y++) {
    const hz = maxHz * (1 - y / h), v = spec[Math.round(hz / binHz)];
    const k = Math.max(0, Math.min(1, (v + 110) / 70));
    g.fillStyle = `hsl(${30 + 200 * (1 - k)},90%,${10 + 50 * k}%)`; g.fillRect(w - 1, y, 1, 1);
  }
}
function drawLevels() {
  const c = $("#levels"), g = c.getContext("2d"); const w = c.width = c.clientWidth, h = c.height;
  g.clearRect(0, 0, w, h);
  const lines = [["emaSubS", "#f59e0b", -110, -30], ["emaLow", "#60a5fa", -110, -30], ["onsetRate", "#f43f5e", 0, 5]];
  for (const [k, col, lo, hi] of lines) {
    g.strokeStyle = col; g.beginPath();
    levelHist.forEach((f, i) => { const x = (i / 600) * w, y = h - ((f[k] - lo) / (hi - lo)) * h; i ? g.lineTo(x, y) : g.moveTo(x, y); });
    g.stroke();
  }
}
function download(name, text, type = "text/csv") {
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click();
}
function toCSV(rows) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  return keys.join(",") + "\n" + rows.map(r => keys.map(k => typeof r[k] === "number" ? r[k].toFixed(3) : JSON.stringify(r[k] ?? "")).join(",")).join("\n");
}
async function stop() {
  clearInterval(timer); rec?.stop(); stream?.getTracks().forEach(t => t.stop()); wakeLock?.release?.();
  const id = ($("#trial").value || "trial").replace(/[^\w-]/g, "_");
  const meta = `# trial_id=${id}, stove=${$("#stove").value}, disc=${$("#disc").checked}, started=${new Date(Date.now() - (performance.now() - t0)).toISOString()}\n`;
  setTimeout(() => {
    download(`${id}_features.csv`, meta + toCSV(featRows));
    download(`${id}_events.csv`, meta + toCSV(eventRows));
    download(`${id}_labels.csv`, meta + toCSV(labelRows));
    if (chunks.length) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType })); a.download = `${id}_audio.webm`; a.click(); }
  }, 400);
  $("#start").disabled = false; $("#stop").disabled = true; setState("idle", "Saved. Copy the 4 files into 04_ANALYSIS/data/raw/<trial_id>/.");
}
document.querySelectorAll(".labels button").forEach(b => b.onclick = () => {
  if (!t0) return;
  const r = { t: (performance.now() - t0) / 1000, label: b.dataset.label };
  labelRows.push(r); logEvent({ t: r.t, type: "LABEL", msg: r.label });
});
$("#start").onclick = () => start().catch(e => { $("#msg").textContent = "Microphone blocked: " + e.message + " (open over https or localhost)"; });
$("#stop").onclick = stop;
$("#testAlarm").onclick = () => {
  const hindi = $("#hindi").checked;
  setState("PRE_BOIL", "Test alarm — not a real boil. " + alertCopy(false, hindi));
  alertUser({ type: "PRE_BOIL", msg: "Test alarm. This is not a boil." });
  if (!timer) setTimeout(() => { if (!timer) setState("idle", "Press Start, then light the stove."); }, 2800);
};
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
