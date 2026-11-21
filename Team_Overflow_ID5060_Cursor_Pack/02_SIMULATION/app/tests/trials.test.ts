import { describe, it, expect } from "vitest";
import { parseTrialsCsv, measuredMarkers, splitCsvLine } from "../src/trials";

describe("trial overlay", () => {
  it("splits quoted commas", () => {
    expect(splitCsvLine('B1,"Amul, taaza",180')).toEqual(["B1", "Amul, taaza", "180"]);
  });

  it("reads measured times and drops example rows", () => {
    const csv = `trial_id,condition,t_first_bubble_s,t_overflow_s,t_app_pre_boil_s,t_knob_down_s,is_example
B1,baseline,180,182.5,,,0
EX,baseline,1,2,,,1
U1,v1,200,,170,185,0
`;
    const { trials, skippedExample } = parseTrialsCsv(csv);
    expect(skippedExample).toBe(1);
    expect(trials.map((t) => t.id)).toEqual(["B1", "U1"]);
    expect(trials[0].firstBubbleS).toBe(180);
    expect(trials[0].overflowS).toBe(182.5);
    expect(trials[0].preBoilS).toBeNull();
    expect(trials[1].preBoilS).toBe(170);
    expect(trials[1].knobDownS).toBe(185);
    const labels = measuredMarkers(trials[1]).map((m) => m.label);
    expect(labels).toContain("measured alarm U1");
    expect(labels).toContain("measured knob U1");
    expect(labels.some((l) => l.includes("overflow"))).toBe(false);
  });

  it("keeps a file with no is_example column", () => {
    const csv = "trial_id,t_first_bubble_s\nB2,191\n";
    const { trials, skippedExample } = parseTrialsCsv(csv);
    expect(skippedExample).toBe(0);
    expect(trials[0].firstBubbleS).toBe(191);
    expect(measuredMarkers(trials[0])).toHaveLength(1);
  });
});
