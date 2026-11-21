import { describe, it, expect } from "vitest";
import { simulate, boilOverNumber, timeToOverflow, steamLps, expansionRatio, SCENARIOS } from "../src/model";

describe("milk model (parity with 04_ANALYSIS/milk_model.py)", () => {
  it("baseline boils over within seconds of first boil", () => {
    const r = simulate();
    expect(r.events.firstBoil).not.toBeNull();
    expect(r.events.overflow).not.toBeNull();
    expect(r.events.overflow! - r.events.firstBoil!).toBeLessThan(10);
    expect(r.events.firstBoil!).toBeGreaterThan(150);
    expect(r.events.firstBoil!).toBeLessThan(210);
  });
  it("magnification numbers", () => {
    expect(expansionRatio()).toBeGreaterThan(1590);
    expect(steamLps(1183)).toBeCloseTo(0.8765, 3);
  });
  it("Pi and t* closed forms", () => {
    expect(boilOverNumber(1, 1183, 14, 10, 500)).toBeCloseTo(0.8433, 3);
    expect(timeToOverflow(1, 0.85, 1183, 14, 10, 500)).toBe(Infinity);
    expect(timeToOverflow(3, 0.85, 1183, 14, 10, 500)).toBeCloseTo(1.2826, 3);
  });
  it("heat-flux rule and chosen hybrid prevent overflow and still reach a boil", () => {
    for (const id of ["lowflame", "hybrid", "detector", "auto"]) {
      const s = SCENARIOS.find(x => x.id === id)!;
      const r = simulate(s.p);
      expect(r.events.overflow, id).toBeNull();
      expect(r.events.reachedBoil, id).toBe(true);
    }
  });
  it("a late alarm fails (Approach a Limit)", () => {
    expect(simulate(SCENARIOS.find(x => x.id === "detector_late")!.p).events.overflow).not.toBeNull();
  });
});
