import { DEFAULTS, boilOverNumber, timeToOverflow, steamLps, expansionRatio, simulate } from "./model";
import { drawChart } from "./chart";

const net = DEFAULTS.knobPowerW * DEFAULTS.efficiency; // ~1183 W on a 1.74 kW LPG burner
const SIG = DEFAULTS.sigma0S + DEFAULTS.sigmaSkinS;     // foaminess with intact skin (ASSUMPTION)

interface Card { id: string; name: string; what: string; op: string; insight: string; rebuild: string; draw: (c: HTMLCanvasElement) => void }

const cards: Card[] = [
  {
    id: "scale", name: "Scale (dimensional analysis)",
    what: "Pot diameter D and the free volume above the milk.",
    op: "Π_BO = Σ·Q_v / V_free,  V_free = (πD²/4)·H_pot − V_milk  ⇒  at fixed height, V_free ∝ D²",
    insight: "Only one dimensionless number decides boil-over: (bubble lifetime × steam rate) ÷ room to grow. Doubling the diameter roughly quadruples the room, but at full flame Π stays above 1: a wider pot delays the spill, it does not prevent it.",
    rebuild: "We stopped looking for the 'right pot' and looked for the lever that moves Π most cheaply: Q_v (heat flux), which we can change at no cost.",
    draw: (c) => {
      const D = Array.from({ length: 33 }, (_, i) => 10 + i * 0.5);
      drawChart(c, [
        { x: D, y: D.map(d => boilOverNumber(SIG, net, d, 10, 500)), color: "#b91c1c", label: "full flame (1.18 kW net)" },
        { x: D, y: D.map(d => boilOverNumber(SIG, 350 * 0.68, d, 10, 500)), color: "#1d4ed8", label: "turned down (0.24 kW)" },
      ], { title: "Π vs pot diameter, 500 mL, 10 cm pot — MODEL", xLabel: "pot diameter D (cm) — axis starts at 0", yLabel: "Π (log)", logY: true, yMin: 0.05, yMax: 20, xMax: 26, hlines: [{ y: 1, label: "boil-over threshold", color: "#57534e" }] });
    },
  },
  {
    id: "magnify", name: "Magnify",
    what: "The volume change when milk-water turns to steam.",
    op: "V_steam / V_water = ρ_l / ρ_v = 958 / 0.598 ≈ 1600   (multiplicative magnification);  Q_v = P / (ρ_v h_fg)",
    insight: `At ${(net / 1000).toFixed(2)} kW net, the pot makes ≈${steamLps(net).toFixed(2)} L of steam every second, from only ≈0.5 g of water. If the bubbles cannot burst, a 1 L headspace fills in about a second. That is why 'calm' turns into 'over the rim' in seconds.`,
    rebuild: "Any fix that relies on noticing foam is too slow. Detection has to happen before saturated boiling, not after foam appears.",
    draw: (c) => {
      const P = Array.from({ length: 50 }, (_, i) => 100 + i * 40);
      drawChart(c, [
        { x: P, y: P.map(p => steamLps(p)), color: "#C2410C", label: "steam made (L/s)" },
        { x: P, y: P.map(p => (0.85 * ((Math.PI * 0.14 ** 2) / 4 * 0.1 - 500e-6)) / (p / (0.598 * 2.257e6))), color: "#1F2A33", label: "s to fill headspace if no bubble bursts", dash: [5, 3] },
      ], { title: `×${expansionRatio().toFixed(0)}: one mL of water becomes 1.6 L of steam — MODEL`, xLabel: "net power into milk (W)", yLabel: "L/s  |  s", yMin: 0, yMax: 10, xMax: 2100 });
    },
  },
  {
    id: "limit", name: "Approach a Limit",
    what: "Time from steady steaming to overflow, t*, as Π approaches 1.",
    op: "dH/dt = U_g/ε − H/τ ⇒ H(t) = H_e(1 − e^(−t/τ)),  t* = −τ·ln(1 − 1/Π)  →  ∞ as Π → 1⁺,  → εV_free/Q_v as Π → ∞",
    insight: "There is a cliff, not a slope. Just above Π = 1 the foam takes forever to reach the rim; at Π ≈ 4 it takes about a second. Getting Π just below 1 at the moment of boiling is enough. You do not need zero heat, only less heat at the right time.",
    rebuild: "The goal changed from 'stop the foam' to 'arrive at the boil with Π < 1'. That gives a timing target: the alarm must come before the boil, early enough to beat human response time plus burner lag.",
    draw: (c) => {
      const pis = Array.from({ length: 200 }, (_, i) => 1.005 + i * 0.05);
      const tau = SIG * DEFAULTS.epsGas;
      drawChart(c, [{ x: pis, y: pis.map(p => -tau * Math.log(1 - 1 / p)), color: "#7c3aed", label: "t* (s)" }],
        { title: "Time to overflow diverges as Π → 1 — MODEL", xLabel: "Π (boil-over number)", yLabel: "t* (s, log)", logY: true, yMin: 0.3, yMax: 100, xMax: 10, hlines: [{ y: 15, label: "≈ human response (ASSUMED 15 s)", color: "#C2410C" }] });
    },
  },
  {
    id: "perturb", name: "Perturb",
    what: "The surface skin (Σ, bubble lifetime), using a disc, stirring, or fat.",
    op: "Σ → kΣ with k < 1  ⇒  Π → kΠ ,  t* → longer;  skin S → S·(1 − r) at each burst",
    insight: "Breaking the film works on the same Π, but only while something keeps breaking it. A spoon or stirring needs a person. A disc on the pot floor perturbs continuously and also rattles, which gives a loud, regular acoustic signal.",
    rebuild: "Use the disc for two jobs: it lowers Σ, and its rattle is a magnified, easy-to-detect sound for the app to hear (an intersection of the two ideas, the Medici effect).",
    draw: (c) => {
      const base = simulate({ stopOnOverflow: false, tMax: 400 }), disc = simulate({ disc: true, tMax: 400 }), stir = simulate({ stirPeriodS: 10, stopOnOverflow: false, tMax: 400 });
      const cut = (r: ReturnType<typeof simulate>) => { const i0 = r.series.t.findIndex(t => t > 150); return { x: r.series.t.slice(i0), y: r.series.fill.slice(i0).map(v => Math.min(v, 1.2) * 100) }; };
      drawChart(c, [
        { ...cut(base), color: "#b91c1c", label: "no perturbation" },
        { ...cut(stir), color: "#a16207", label: "film broken every 10 s", dash: [4, 3] },
        { ...cut(disc), color: "#15803d", label: "disc (Σ×0.45 ASSUMED)" },
      ], { title: "Foam as % of headroom — MODEL, effect sizes ASSUMED", xLabel: "time (s)", yLabel: "%", yMin: 0, yMax: 120, hlines: [{ y: 100, label: "rim", color: "#57534e" }] });
    },
  },
  {
    id: "frame", name: "Change Frame",
    what: "Who closes the control loop. Before: a person's eyes on the pot. After: the pot's sound reaches a phone, then the person or a relay.",
    op: "Success ⇔ lead time L = t_boil − t_alarm  >  t_response + τ_burner + margin",
    insight: "The real problem was never 'milk foams'. It is that the only sensor in the loop was a person staring at the pot. Moving the sensor to the phone turns non-stop watching into one alarm. The maths then says how early that alarm must be.",
    rebuild: "We built Ubaal, a phone web app that listens for the pre-boil sound signature and tells you to turn the flame down before the boil. We tested it against the no-aid baseline.",
    draw: (c) => {
      const T = Array.from({ length: 26 }, (_, i) => 75 + i);
      const lead = T.map(tr => { const r = simulate({ detector: true, detectorTriggerC: tr, stopOnOverflow: false, tMax: 400 }); return r.events.firstBoil !== null && r.events.alarm !== null ? r.events.firstBoil - r.events.alarm : NaN; });
      const ok = T.map(tr => (simulate({ detector: true, detectorTriggerC: tr }).events.overflow === null ? 60 : 0));
      drawChart(c, [
        { x: T.map(t => t - 75), y: lead, color: "#1F2A33", label: "alarm lead before boil (s)" },
        { x: T.map(t => t - 75), y: ok, color: "#15803d", label: "no boil-over (60) / boil-over (0)", dash: [3, 3] },
      ], { title: "Earlier cue ⇒ more lead ⇒ no spill (x = cue temp − 75 °C) — MODEL", xLabel: "cue temperature − 75 °C", yLabel: "s", yMin: 0, yMax: 70, xMax: 25, hlines: [{ y: DEFAULTS.humanResponseS + DEFAULTS.burnerTauS, label: "response + burner lag (ASSUMED)", color: "#C2410C" }] });
    },
  },
];

export function renderTransformers(root: HTMLElement) {
  root.innerHTML = cards.map(k => `<div class="panel tcard"><h3>${k.name}</h3>
    <p><b>What we transformed:</b> ${k.what}</p><span class="op">${k.op}</span>
    <canvas id="tc-${k.id}"></canvas>
    <p><b>Insight:</b> ${k.insight}</p><p><b>How it changed the rebuild:</b> ${k.rebuild}</p></div>`).join("");
  for (const k of cards) k.draw(document.getElementById(`tc-${k.id}`) as HTMLCanvasElement);
}
