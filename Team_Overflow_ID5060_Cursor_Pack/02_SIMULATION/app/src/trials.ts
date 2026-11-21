/** Parse a trials.csv export and turn measured event times into chart markers.
 * Rows with is_example=1 are skipped. They must never be drawn as measurements. */

export interface TrialMark {
  id: string;
  condition: string;
  firstBubbleS: number | null;
  overflowS: number | null;
  preBoilS: number | null;
  knobDownS: number | null;
}

export interface Marker {
  x: number;
  label: string;
  color: string;
}

export function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else quoted = false;
      } else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

function num(v: string | undefined): number | null {
  if (v === undefined) return null;
  const t = v.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function parseTrialsCsv(text: string): { trials: TrialMark[]; skippedExample: number } {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (!lines.length) return { trials: [], skippedExample: 0 };
  const header = splitCsvLine(lines[0]).map((h) => h.trim());
  const col = (row: string[], name: string) => {
    const i = header.indexOf(name);
    return i >= 0 ? row[i] ?? "" : "";
  };
  const trials: TrialMark[] = [];
  let skippedExample = 0;
  for (const line of lines.slice(1)) {
    const row = splitCsvLine(line);
    if (col(row, "is_example").trim() === "1") { skippedExample++; continue; }
    trials.push({
      id: col(row, "trial_id").trim() || `row-${trials.length + 1}`,
      condition: col(row, "condition").trim(),
      firstBubbleS: num(col(row, "t_first_bubble_s")),
      overflowS: num(col(row, "t_overflow_s")),
      preBoilS: num(col(row, "t_app_pre_boil_s")),
      knobDownS: num(col(row, "t_knob_down_s")),
    });
  }
  return { trials, skippedExample };
}

const MEASURED = "#15803d";

export function measuredMarkers(t: TrialMark): Marker[] {
  const out: Marker[] = [];
  const add = (x: number | null, what: string) => {
    if (x === null) return;
    out.push({ x, label: `measured ${what} ${t.id}`, color: MEASURED });
  };
  add(t.preBoilS, "alarm");
  add(t.knobDownS, "knob");
  add(t.firstBubbleS, "bubble");
  add(t.overflowS, "overflow");
  return out;
}
