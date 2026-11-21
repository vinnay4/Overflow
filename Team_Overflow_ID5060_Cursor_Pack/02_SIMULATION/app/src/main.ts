import { DEFAULTS, Params, simulate, Result, SCENARIOS, hHead, hLiq, boilOverNumber, timeToOverflow, steamLps, expansionRatio, RHO_VAP, H_FG } from "./model";
import { drawChart } from "./chart";
import { drawPot } from "./pot";
import { renderTransformers } from "./transformers";
import { renderAssumptions } from "./assumptions";

type Num = { key: keyof Params; label: string; min: number; max: number; step: number; unit: string; note: string; group: string };
const NUMS: Num[] = [
  { key: "volumeMl", label: "Milk volume", min: 150, max: 1000, step: 10, unit: "mL", note: "Scope: 250–500 mL packaged milk", group: "SCENARIO" },
  { key: "potDcm", label: "Pot inner diameter", min: 10, max: 26, step: 0.5, unit: "cm", note: "ASSUMPTION 14 cm — measure your pot", group: "SCENARIO" },
  { key: "potHcm", label: "Pot inner height", min: 6, max: 18, step: 0.5, unit: "cm", note: "ASSUMPTION 10 cm — measure", group: "SCENARIO" },
  { key: "knobPowerW", label: "Burner / hob power", min: 300, max: 2500, step: 10, unit: "W", note: "IS 4246: ≥1 burner ≥1.74 kW", group: "SCENARIO" },
  { key: "efficiency", label: "Heat-transfer efficiency", min: 0.4, max: 0.95, step: 0.01, unit: "", note: "Gas ≥0.64 (IS 4246); induction ≥0.80 (BEE)", group: "SCENARIO" },
  { key: "sigmaSkinS", label: "Foaminess added by skin Σskin", min: 0, max: 12, step: 0.1, unit: "s", note: "ASSUMPTION — fit from baseline video", group: "MILK (fit these)" },
  { key: "sigma0S", label: "Foaminess without skin Σ0", min: 0.05, max: 3, step: 0.05, unit: "s", note: "ASSUMPTION", group: "MILK (fit these)" },
  { key: "lowPowerW", label: "Power after turn-down", min: 100, max: 1000, step: 10, unit: "W", note: "knob at 'sim'", group: "FIXES" },
  { key: "detectorTriggerC", label: "App cue temperature", min: 60, max: 100, step: 0.5, unit: "°C", note: "ASSUMPTION — set from measured lead time", group: "FIXES" },
  { key: "humanResponseS", label: "Human response time", min: 0, max: 60, step: 1, unit: "s", note: "ASSUMPTION — time yourselves", group: "FIXES" },
  { key: "lidExtraCm", label: "Containment lid adds", min: 0, max: 8, step: 0.5, unit: "cm", note: "silicone flower lid", group: "FIXES" },
  { key: "stirPeriodS", label: "Break film every", min: 0, max: 30, step: 1, unit: "s", note: "0 = never (needs a person)", group: "FIXES" },
];
type Tog = { key: keyof Params; label: string; note: string };
const TOGS: Tog[] = [
  { key: "disc", label: "Milk-watcher disc (Perturb)", note: "effect size ASSUMED ×0.45 on Σ" },
  { key: "detector", label: "Ubaal acoustic alarm (Change Frame)", note: "person turns knob after response time" },
];

let P: Params = { ...DEFAULTS };
let R: Result = simulate(P);
let playing = false, playT = 0, lastFrame = 0;

const $ = <T extends HTMLElement>(s: string) => document.querySelector(s) as T;

function buildControls() {
  const el = $("#controls");
  let html = "", g = "";
  for (const n of NUMS) {
    if (n.group !== g) { g = n.group; html += `<div class="group">${g}</div>`; }
    html += `<div class="ctl"><label>${n.label}<span id="v-${n.key}"></span></label>
      <input type="range" id="i-${n.key}" min="${n.min}" max="${n.max}" step="${n.step}" value="${P[n.key]}"/><small>${n.note}</small></div>`;
    if (n.key === "efficiency") {
      html += `<div class="ctl"><label>Stove</label><select id="i-stove"><option value="gas">Gas (LPG)</option><option value="induction">Induction</option></select></div>`;
    }
  }
  html += `<div class="group">TOGGLES</div>`;
  for (const t of TOGS) html += `<label class="toggle"><input type="checkbox" id="i-${t.key}"/> <span>${t.label}<small style="display:block;color:#6b6357">${t.note}</small></span></label>`;
  html += `<div class="ctl"><label>Response</label><select id="i-response"><option value="human">Human turns knob</option><option value="auto">Automatic (induction + relay)</option></select></div>`;
  html += `<div class="group">PRESETS</div><select id="preset">${SCENARIOS.map(s => `<option value="${s.id}">${s.label}</option>`).join("")}</select>`;
  el.innerHTML = html;
  for (const n of NUMS) {
    const inp = $<HTMLInputElement>(`#i-${n.key}`);
    inp.oninput = () => { (P as any)[n.key] = parseFloat(inp.value); rerun(); };
  }
  for (const t of TOGS) {
    const inp = $<HTMLInputElement>(`#i-${t.key}`);
    inp.onchange = () => { (P as any)[t.key] = inp.checked; rerun(); };
  }
  $<HTMLSelectElement>("#i-stove").onchange = (e) => {
    const v = (e.target as HTMLSelectElement).value as Params["stove"];
    P.stove = v;
    if (v === "induction") { P.efficiency = 0.8; P.burnerTauS = 1.5; P.knobPowerW = 1600; } else { P.efficiency = 0.68; P.burnerTauS = 8; P.knobPowerW = 1740; }
    syncInputs(); rerun();
  };
  $<HTMLSelectElement>("#i-response").onchange = (e) => { P.response = (e.target as HTMLSelectElement).value as Params["response"]; rerun(); };
  $<HTMLSelectElement>("#preset").onchange = (e) => {
    const s = SCENARIOS.find(x => x.id === (e.target as HTMLSelectElement).value)!;
    P = { ...DEFAULTS, ...s.p }; syncInputs(); rerun();
  };
}
function syncInputs() {
  for (const n of NUMS) { $<HTMLInputElement>(`#i-${n.key}`).value = String(P[n.key]); }
  for (const t of TOGS) { $<HTMLInputElement>(`#i-${t.key}`).checked = Boolean(P[t.key]); }
  $<HTMLSelectElement>("#i-stove").value = P.stove;
  $<HTMLSelectElement>("#i-response").value = P.response;
}
function labels() {
  for (const n of NUMS) $(`#v-${n.key}`).textContent = `${(P[n.key] as number).toFixed(n.step < 1 ? (n.step < 0.1 ? 2 : 1) : 0)} ${n.unit}`;
}
const fmt = (v: number | null, d = 0) => (v === null || !Number.isFinite(v) ? "—" : v.toFixed(d));

function rerun() {
  labels();
  R = simulate(P);
  playT = R.series.t[R.series.t.length - 1];
  renderCharts(); renderOutcome(); renderPotAt(playT);
}
function idxAt(t: number) {
  const s = R.series.t; let i = Math.min(s.length - 1, Math.floor(t / P.dt));
  return Math.max(0, i);
}
function renderPotAt(t: number) {
  const i = idxAt(t), s = R.series, ev = R.events;
  drawPot($<HTMLCanvasElement>("#pot"), {
    T: s.T[i], S: s.S[i], fill: s.fill[i], liqFrac: hLiq(P) / (P.potHcm / 100), power01: Math.min(1, s.P[i] / (P.knobPowerW * P.efficiency)),
    stove: P.stove, overflow: ev.overflow !== null && t >= ev.overflow, disc: P.disc, lidExtraFrac: P.lidExtraCm / P.potHcm,
    alarm: ev.alarm !== null && t >= ev.alarm, t,
  });
  ($<HTMLInputElement>("#scrub")).value = String(Math.round((t / s.t[s.t.length - 1]) * 1000));
}
function renderCharts() {
  const s = R.series, ev = R.events;
  const mk: { x: number; label: string; color: string }[] = [];
  if (ev.alarm !== null) mk.push({ x: ev.alarm, label: "alarm", color: "#C2410C" });
  if (ev.knobChange !== null) mk.push({ x: ev.knobChange, label: "knob ↓", color: "#1d4ed8" });
  if (ev.firstBoil !== null) mk.push({ x: ev.firstBoil, label: "boil", color: "#57534e" });
  if (ev.overflow !== null) mk.push({ x: ev.overflow, label: "OVERFLOW", color: "#b91c1c" });
  const xMax = s.t[s.t.length - 1];
  drawChart($("#cT") as HTMLCanvasElement, [
    { x: s.t, y: s.T, color: "#C2410C", label: "milk T (°C)" },
    { x: s.t, y: s.S.map(v => v * 100), color: "#a16207", label: "skin index ×100", dash: [4, 3] },
  ], { title: "Temperature and skin — MODEL", xLabel: "time (s)", yLabel: "°C / index", yMin: 0, yMax: 105, xMax, markers: mk });
  drawChart($("#cFill") as HTMLCanvasElement, [
    { x: s.t, y: s.fill.map(v => v * 100), color: "#1F2A33", label: "foam as % of headroom" },
    { x: s.t, y: s.P.map(v => v / 20), color: "#1d4ed8", label: "delivered power ÷20 (W)", dash: [4, 3] },
  ], { title: "Foam vs headroom — overflow at 100%", xLabel: "time (s)", yLabel: "%", yMin: 0, yMax: 120, xMax, markers: mk, hlines: [{ y: 100, label: "rim", color: "#b91c1c" }] });
  drawChart($("#cPi") as HTMLCanvasElement, [
    { x: s.t, y: s.Pi.map(v => Math.max(v, 1e-3)), color: "#7c3aed", label: "boil-over number Π = ΣQv/Vfree" },
  ], { title: "Π > 1 ⇒ steady foam taller than headroom", xLabel: "time (s)", yLabel: "Π (log)", logY: true, yMin: 0.01, yMax: 30, xMax, markers: mk, hlines: [{ y: 1, label: "Π = 1", color: "#b91c1c" }] });
}
function renderOutcome() {
  const ev = R.events;
  const ok = ev.overflow === null;
  const fullBoil = ev.reachedBoil && ok;
  const lead = ev.alarm !== null && ev.firstBoil !== null ? ev.firstBoil - ev.alarm : null;
  const net = P.knobPowerW * P.efficiency;
  const piFull = boilOverNumber(P.sigma0S + P.sigmaSkinS, net, P.potDcm, P.potHcm, P.volumeMl, P.lidExtraCm);
  const tStar = timeToOverflow(P.sigma0S + P.sigmaSkinS, P.epsGas, net, P.potDcm, P.potHcm, P.volumeMl);
  $("#outcome").innerHTML = `
    <div class="kpi ${ok ? "ok" : "bad"}">Outcome<b>${ok ? "No boil-over" : "Boil-over at " + fmt(ev.overflow, 1) + " s"}</b><small>${fullBoil ? "full boil held 60 s" : ev.reachedBoil ? "reached boil" : "did NOT reach boil"}</small></div>
    <div class="kpi">Headroom<b>${(hHead(P) * 100).toFixed(1)} cm</b><small>milk depth ${(hLiq(P) * 100).toFixed(1)} cm</small></div>
    <div class="kpi">Steam at full power<b>${steamLps(net).toFixed(2)} L/s</b><small>1 mL water → ${expansionRatio().toFixed(0)} mL steam</small></div>
    <div class="kpi ${piFull > 1 ? "bad" : "ok"}">Π at full power, skin intact<b>${piFull.toFixed(2)}</b><small>t* to overflow ≈ ${Number.isFinite(tStar) ? tStar.toFixed(1) + " s" : "never (Π≤1)"}</small></div>
    <div class="kpi">Alarm lead before boil<b>${fmt(lead, 1)} s</b><small>needs > response ${P.humanResponseS}s + burner lag ${P.burnerTauS}s</small></div>
    <div class="kpi">Time to first boil<b>${fmt(ev.firstBoil, 0)} s</b><small>model; calibrate h_loss to your measured time</small></div>`;
}
function loop(ts: number) {
  if (playing) {
    const dt = (ts - lastFrame) / 1000;
    playT += dt * parseFloat(($("#speed") as HTMLSelectElement).value);
    const end = R.series.t[R.series.t.length - 1];
    if (playT >= end) { playT = end; playing = false; $("#play").textContent = "▶ Play"; }
    renderPotAt(playT);
  }
  lastFrame = ts;
  requestAnimationFrame(loop);
}
function renderCompare() {
  const rows = SCENARIOS.map(s => {
    const r = simulate(s.p); const e = r.events;
    const lead = e.alarm !== null && e.firstBoil !== null ? e.firstBoil - e.alarm : null;
    return `<tr><td>${s.label}</td><td>${s.transformer}</td>
      <td class="${e.overflow === null ? "ok" : "bad"}">${e.overflow === null ? "no" : "YES @ " + e.overflow.toFixed(0) + " s"}</td>
      <td>${e.reachedBoil && e.overflow === null ? "yes" : e.reachedBoil ? "reached, spilled" : "no"}</td>
      <td>${fmt(e.firstBoil, 0)}</td><td>${(Math.min(e.maxFill, 1) * 100).toFixed(0)}%</td><td>${fmt(lead, 0)}</td></tr>`;
  }).join("");
  $("#cmp").innerHTML = `<tr><th>Scenario</th><th>Transformer</th><th>Boil-over?</th><th>Full boil?</th><th>t boil (s)</th><th>max foam / headroom</th><th>alarm lead (s)</th></tr>${rows}`;
}
document.querySelectorAll("nav button").forEach(b => (b as HTMLButtonElement).onclick = () => {
  document.querySelectorAll("nav button").forEach(x => x.classList.remove("on"));
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("on"));
  b.classList.add("on");
  const id = (b as HTMLElement).dataset.tab!;
  $(`#tab-${id}`).classList.add("on");
  if (id === "compare") renderCompare();
  if (id === "transformers") renderTransformers($("#tcards"));
  if (id === "sim") rerun();
});
$("#play").onclick = () => {
  if (!playing && playT >= R.series.t[R.series.t.length - 1] - 0.01) playT = 0;
  playing = !playing; $("#play").textContent = playing ? "❚❚ Pause" : "▶ Play";
};
($("#scrub") as HTMLInputElement).oninput = (e) => {
  playing = false; $("#play").textContent = "▶ Play";
  playT = (parseFloat((e.target as HTMLInputElement).value) / 1000) * R.series.t[R.series.t.length - 1];
  renderPotAt(playT);
};
buildControls(); syncInputs(); rerun(); renderAssumptions($("#assump"));
window.addEventListener("resize", () => rerun());
const h = location.hash.replace("#", "");
if (h) (document.querySelector(`nav button[data-tab="${h}"]`) as HTMLButtonElement | null)?.click();
requestAnimationFrame(loop);
// expose for debugging in the console
(window as any).overflow = { simulate, P: () => P, RHO_VAP, H_FG };
