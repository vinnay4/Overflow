import { DEFAULTS } from "./model";
const rows: [string, string, string, string][] = [
  ["ρ_milk", "1030 kg/m³", "SOURCE", "Goff, Dairy Science & Technology eBook (U. Guelph): 1027–1033 kg/m³ at 20 °C"],
  ["c_milk", "3900 J/kg·K", "SOURCE", "Minim et al., J. Chem. Eng. Data 47 (2002) 1488–1491 (whole milk 3.4–4.1 kJ/kg·K)"],
  ["T_boil (milk)", "100.5 °C", "SOURCE", "S.R. Sankar (TNCMPF/Aavin QC), The Hindu, 2014"],
  ["ρ_vapour, h_fg", "0.598 kg/m³, 2257 kJ/kg", "SOURCE", "Engineering ToolBox saturated steam table, 100 °C"],
  ["Burner power", "1.74 kW", "SOURCE", "IS 4246:2002: at least one burner ≥ 1490 kcal/h"],
  ["Gas efficiency", "0.68", "SOURCE", "IS 4246: ≥ 64 % required, 68 % declarable"],
  ["Induction efficiency", "0.80", "SOURCE", "BEE induction hob schedule, IS 19014: ≥ 80 % for star label"],
  ["Skin onset", "70 °C", "SOURCE", "Singh 2007 (Lait): β-Lg and α-La denature significantly above 70–75 °C"],
  ["Σ (foaminess) definition", "Σ = H_e/U_g", "SOURCE", "Bikerman test, in Pugh, Bubble and Foam Chemistry (CUP 2016), ch. 11"],
  ["Pot D × H, mass", `${DEFAULTS.potDcm} × ${DEFAULTS.potHcm} cm, ${DEFAULTS.potMassKg} kg`, "ASSUMPTION", "Measure your own pot"],
  ["Σ0, Σskin", `${DEFAULTS.sigma0S} s, ${DEFAULTS.sigmaSkinS} s`, "ASSUMPTION", "Fit from baseline foam-height video and static foam half-life"],
  ["ε (gas fraction)", `${DEFAULTS.epsGas}`, "ASSUMPTION", "Typical wet foam; low sensitivity"],
  ["h_loss", `${DEFAULTS.hLoss} W/m²K`, "ASSUMPTION", "Calibrate so model time-to-boil matches measured"],
  ["Burner lag τ", `${DEFAULTS.burnerTauS} s gas / 1.5 s induction`, "ASSUMPTION", "Measure: knob down → bubbling subsides"],
  ["Disc effect k", `${DEFAULTS.discSigmaFactor}`, "ASSUMPTION", "TO BE MEASURED (paired trials)"],
  ["App cue temperature", `${DEFAULTS.detectorTriggerC} °C`, "ASSUMPTION", "Set from measured cue→boil lead time"],
  ["Human response", `${DEFAULTS.humanResponseS} s`, "ASSUMPTION", "Time yourselves: alarm → hand on knob"],
];
export function renderAssumptions(el: HTMLElement) {
  el.innerHTML = `<h2>Governing equations</h2>
  <p><b>Energy:</b> <code>(m c_m + m_p c_p) dT/dt = (1 − g(T))·(η P − L)</code>, with <code>L = h A_exp (T − T_amb)</code>, and <code>g(T)</code> the share of heat that leaves as steam reaching the surface. It rises smoothly from 0 (subcooled: bubbles collapse) to 1 at the boil.</p>
  <p><b>Steam:</b> <code>Q_v = g·(ηP − L)/(ρ_v h_fg)</code>, <code>U_g = Q_v/A</code></p>
  <p><b>Skin:</b> <code>dS/dt = k_s·max(0,(T − 70)/(T_b − 70))·(1 − S)</code>. A perturbation multiplies S by (1 − r).</p>
  <p><b>Foam (Bikerman balance):</b> <code>dH/dt = U_g/ε − H/τ</code>, <code>Σ = τ/ε = Σ0 + Σskin·S</code>, steady height <code>H_e = Σ·U_g</code></p>
  <p><b>Boil-over number:</b> <code>Π = Σ U_g / h_head = Σ Q_v / V_free</code>. Boil-over happens when <code>h_liq + H ≥ H_pot</code>. Closed form: <code>t* = −τ ln(1 − 1/Π)</code>.</p>
  <h2>Parameters</h2><table><tr><th>Symbol</th><th>Value</th><th>Status</th><th>Source / how to measure</th></tr>
  ${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td><span class="tag ${r[2] === "SOURCE" ? "s" : "a"}">${r[2]}</span></td><td>${r[3]}</td></tr>`).join("")}</table>
  <h2>What this model does not do</h2>
  <ul><li>It is lumped (0-D). There is no spatial temperature field, no bubble-size distribution, and no wall nucleation physics.</li>
  <li>The foam balance is linear. Real protein foams can show runaway behaviour: Hutzler et al. 2011 report foam height diverging at a critical gas velocity. Our Π threshold is the linear version of that.</li>
  <li>Skin kinetics are a placeholder shape, not fitted Arrhenius kinetics.</li>
  <li>It predicts trends to decide what to test. It never replaces the 10-trial measurement.</li></ul>`;
}
