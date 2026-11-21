// Animated cross-section of the pot: milk, skin, foam, flame/coil, overflow.
export interface PotFrame {
  T: number; S: number; fill: number; liqFrac: number; power01: number;
  stove: "gas" | "induction"; overflow: boolean; disc: boolean; lidExtraFrac: number; alarm: boolean; t: number;
}
export function drawPot(cv: HTMLCanvasElement, f: PotFrame) {
  const dpr = window.devicePixelRatio || 1;
  const w = cv.clientWidth || 360, h = cv.clientHeight || 300;
  cv.width = w * dpr; cv.height = h * dpr;
  const c = cv.getContext("2d")!;
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, w, h);
  const potW = w * 0.58, potH = h * 0.5, x0 = (w - potW) / 2, yBase = h * 0.78, yTop = yBase - potH;
  // stove
  if (f.stove === "gas") {
    const n = 9;
    for (let i = 0; i < n; i++) {
      const fx = x0 + 20 + (i * (potW - 40)) / (n - 1);
      const fh = 6 + 22 * f.power01 * (0.8 + 0.2 * Math.sin(f.t * 9 + i));
      const grd = c.createLinearGradient(fx, yBase + 30, fx, yBase + 30 - fh);
      grd.addColorStop(0, "#1d4ed8"); grd.addColorStop(1, "rgba(59,130,246,0.1)");
      c.fillStyle = grd; c.beginPath();
      c.moveTo(fx - 5, yBase + 30); c.quadraticCurveTo(fx, yBase + 30 - fh * 1.4, fx + 5, yBase + 30); c.fill();
    }
  } else {
    c.strokeStyle = `rgba(234,88,12,${0.2 + 0.8 * f.power01})`; c.lineWidth = 3;
    for (let r = 10; r < potW / 2; r += 14) { c.beginPath(); c.ellipse(w / 2, yBase + 22, r, 5, 0, 0, Math.PI * 2); c.stroke(); }
  }
  // liquid
  const liqH = potH * f.liqFrac;
  const yLiq = yBase - liqH;
  const warm = Math.min(1, Math.max(0, (f.T - 20) / 80));
  c.fillStyle = `rgb(${250},${248 - warm * 10},${240 - warm * 30})`;
  c.fillRect(x0, yLiq, potW, liqH);
  // bubbles rising near boil
  const nb = Math.floor(Math.max(0, (f.T - 85) / 15) * 30);
  c.fillStyle = "rgba(255,255,255,0.9)";
  for (let i = 0; i < nb; i++) {
    const bx = x0 + 8 + ((i * 53.7 + f.t * 30) % (potW - 16));
    const by = yBase - ((i * 37.1 + f.t * 60) % Math.max(liqH, 1));
    c.beginPath(); c.arc(bx, by, 2 + (i % 3), 0, Math.PI * 2); c.fill();
  }
  // foam
  const headPx = yLiq - yTop;
  const foamPx = Math.min(f.fill, 1.15) * headPx;
  if (foamPx > 0.5) {
    for (let i = 0; i < 260 * Math.min(1, foamPx / headPx + 0.1); i++) {
      const bx = x0 + ((i * 97.3) % potW);
      const by = yLiq - ((i * 13.7) % Math.max(foamPx, 1));
      c.fillStyle = `rgba(255,253,247,${0.85})`; c.strokeStyle = "rgba(200,190,170,0.6)";
      c.beginPath(); c.arc(bx, by, 4 + (i % 4), 0, Math.PI * 2); c.fill(); c.stroke();
    }
  }
  // skin
  if (f.S > 0.02) {
    c.strokeStyle = `rgba(194,140,60,${Math.min(0.9, f.S)})`; c.lineWidth = 2 + 3 * f.S;
    const ys = yLiq - foamPx;
    c.beginPath(); c.moveTo(x0 + 2, ys);
    for (let x = 0; x <= potW; x += 12) c.lineTo(x0 + x, ys + Math.sin(x * 0.3 + f.t) * 1.5 * f.S);
    c.stroke();
  }
  // overflow drips
  if (f.overflow) {
    c.fillStyle = "rgba(255,253,247,0.95)";
    c.beginPath(); c.ellipse(x0 - 6, yTop + 40, 10, 44, 0.1, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(x0 + potW + 6, yTop + 50, 9, 50, -0.1, 0, Math.PI * 2); c.fill();
  }
  // disc
  if (f.disc) { c.fillStyle = "#93c5fd"; c.fillRect(w / 2 - 22, yBase - 6, 44, 5); }
  // pot walls
  c.strokeStyle = "#57534e"; c.lineWidth = 5;
  c.beginPath(); c.moveTo(x0, yTop); c.lineTo(x0, yBase); c.lineTo(x0 + potW, yBase); c.lineTo(x0 + potW, yTop); c.stroke();
  if (f.lidExtraFrac > 0) {
    c.strokeStyle = "#16a34a"; c.lineWidth = 3;
    const ly = yTop - potH * f.lidExtraFrac;
    c.beginPath(); c.moveTo(x0 - 10, yTop); c.lineTo(x0 - 4, ly); c.lineTo(x0 + potW + 4, ly); c.lineTo(x0 + potW + 10, yTop); c.stroke();
  }
  c.fillStyle = "#1F2A33"; c.font = "13px ui-sans-serif, system-ui";
  c.fillText(`${f.T.toFixed(1)} °C`, 10, 20);
  c.fillText(`foam fills ${(Math.min(f.fill, 1) * 100).toFixed(0)}% of headroom`, 10, 38);
  if (f.alarm) { c.fillStyle = "#C2410C"; c.fillText("🔔 Ubaal alarm", w - 120, 20); }
  if (f.overflow) { c.fillStyle = "#b91c1c"; c.font = "bold 18px ui-sans-serif"; c.fillText("BOIL-OVER", w / 2 - 50, yTop - 12); }
}
