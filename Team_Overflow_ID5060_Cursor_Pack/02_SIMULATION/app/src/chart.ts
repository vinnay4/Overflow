// Tiny dependency-free canvas line chart (keeps the site static and offline-friendly).
export interface Line { x: number[]; y: number[]; color: string; label: string; dash?: number[] }
export interface ChartOpts {
  title: string; xLabel: string; yLabel: string;
  yMin?: number; yMax?: number; xMax?: number;
  markers?: { x: number; label: string; color: string }[];
  hlines?: { y: number; label: string; color: string }[];
  logY?: boolean;
}

export function drawChart(canvas: HTMLCanvasElement, lines: Line[], o: ChartOpts) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 480, h = canvas.clientHeight || 220;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const c = canvas.getContext("2d")!;
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, w, h);
  const m = { l: 64, r: 12, t: 26, b: 34 };
  const allX = lines.flatMap(l => l.x), allY = lines.flatMap(l => l.y).filter(Number.isFinite);
  const xMax = o.xMax ?? Math.max(1, ...allX);
  const tr = (v: number) => (o.logY ? Math.log10(Math.max(v, 1e-6)) : v);
  let yMin = o.yMin ?? Math.min(...allY.map(tr)), yMax = o.yMax ?? Math.max(...allY.map(tr));
  if (o.logY) { yMin = o.yMin !== undefined ? tr(o.yMin) : yMin; yMax = o.yMax !== undefined ? tr(o.yMax) : yMax; }
  if (yMax - yMin < 1e-9) yMax = yMin + 1;
  const X = (v: number) => m.l + (v / xMax) * (w - m.l - m.r);
  const Y = (v: number) => h - m.b - ((tr(v) - yMin) / (yMax - yMin)) * (h - m.t - m.b);
  c.font = "12px ui-sans-serif, system-ui, sans-serif";
  c.fillStyle = "#1F2A33"; c.fillText(o.title, m.l, 16);
  c.strokeStyle = "#d9d2c3"; c.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const yy = m.t + (i * (h - m.t - m.b)) / 4;
    c.beginPath(); c.moveTo(m.l, yy); c.lineTo(w - m.r, yy); c.stroke();
    const val = yMax - (i * (yMax - yMin)) / 4;
    c.fillStyle = "#6b6357";
    c.fillText(o.logY ? (10 ** val).toPrecision(2) : val.toFixed(Math.abs(yMax - yMin) < 5 ? 2 : 0), 22, yy + 4);
  }
  for (let i = 0; i <= 5; i++) {
    const xv = (i * xMax) / 5;
    c.fillText(xv.toFixed(xMax < 10 ? 1 : 0), X(xv) - 8, h - m.b + 14);
  }
  c.fillText(o.xLabel, w / 2 - 20, h - 4);
  c.save(); c.translate(12, h / 2 + 30); c.rotate(-Math.PI / 2); c.fillText(o.yLabel, 0, 0); c.restore();
  for (const hl of o.hlines ?? []) {
    c.strokeStyle = hl.color; c.setLineDash([5, 4]);
    c.beginPath(); c.moveTo(m.l, Y(hl.y)); c.lineTo(w - m.r, Y(hl.y)); c.stroke(); c.setLineDash([]);
    c.fillStyle = hl.color; c.fillText(hl.label, w - m.r - c.measureText(hl.label).width, Y(hl.y) - 4);
  }
  for (const l of lines) {
    c.strokeStyle = l.color; c.lineWidth = 2; c.setLineDash(l.dash ?? []);
    c.beginPath();
    let started = false;
    for (let i = 0; i < l.x.length; i++) {
      if (!Number.isFinite(l.y[i])) { started = false; continue; }
      const px = X(l.x[i]), py = Math.max(m.t - 4, Math.min(h - m.b, Y(l.y[i])));
      if (!started) { c.moveTo(px, py); started = true; } else c.lineTo(px, py);
    }
    c.stroke(); c.setLineDash([]);
  }
  (o.markers ?? []).forEach((mk, k) => {
    c.strokeStyle = mk.color; c.setLineDash([2, 3]);
    c.beginPath(); c.moveTo(X(mk.x), m.t); c.lineTo(X(mk.x), h - m.b); c.stroke(); c.setLineDash([]);
    c.fillStyle = mk.color; c.fillText(mk.label, Math.min(X(mk.x) + 3, w - 90), m.t + 22 + k * 13);
  });
  let lx = m.l + 6;
  for (const l of lines) {
    c.fillStyle = l.color; c.fillRect(lx, m.t + 2, 10, 3);
    c.fillStyle = "#1F2A33"; c.fillText(l.label, lx + 14, m.t + 8);
    lx += c.measureText(l.label).width + 34;
  }
}
