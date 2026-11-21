# Rimclip

A stainless clip for a home pot of milk. It is a design. It has not been bent, boiled, or timed.

## Why a clip that falls at the rim does not work

The foam does not creep. In the model, a 14 cm pot of 500 mL goes from first boil to over the rim in about **2.2 seconds**. A person in the next room, at the 15 seconds we assumed for a response, cannot get to the knob. A latch that releases when the foam is already high is the same late sensor as a pair of eyes.

Waiting for the milk to expand does not help either. From fridge to boil the liquid swells by about 4% (water density 999.8 kg/m³ at 8 °C, 958 kg/m³ at 100 °C). On 500 mL in a 14 cm pot that is about 22 mL, or **about 1.4 mm** of rise. There is no travel to drop a weight.

A spoon or a pat of butter only delays the spill. Steam keeps being made, so the foam comes back. America’s Test Kitchen says the same.

## What this clip does instead

Two jobs, on one piece of wire.

1. **A notched disc stays in the surface the whole time.** It tries to cut the protein skin so bubbles burst sooner. That is the 1938 milk-watcher idea (Kreiner, Ulm, 2015). It attacks Σ in Π = Σ · Qᵥ / V_free. We have not measured how much Σ falls. The simulator’s ×0.45 is an assumption. Do not claim the disc prevents a boil-over.

2. **A loose head on the same pin taps an anvil** when bubbles shake the disc. The noise is meant to start in the subcooled hiss, the same early stage a kettle is loudest (peak around 60–70 °C in water, quieter by about 95 °C — that source is a kettle, not milk). Whether the tap is loud enough in the next room is untested.

Ubaal, the phone, stays the chosen rebuild. In the model its cue is about 24 seconds before the boil, and it needs no new part. Rimclip is the thing to bend if a phone is not allowed.

## Make it

- SS304 wire, 2.5–3 mm, one piece for the jaw, the drop, and the yoke.
- SS304 disc, 40 mm × 1.2 mm, six radial notches, hole for a 2.2 mm pin.
- Loose striker on that pin, head about 4.5 mm, resting a couple of millimetres under a tab on the arm.
- Jaw slot 2.6 mm, for a thin steel rim. Squeeze it to the pot you actually have.
- Pose in the model: 14 cm pot, 500 mL, wire centre about 67 mm below the rim, disc centre 52 mm in from the slot.

No plastic, no printed PLA, no silicone on a gas rim. The flame will melt it. Keep the jaw on the rim and the arm inside the pot, clear of the flame. The pin is captive so the disc and the head cannot fall into the milk.

## Files

| File | What it is |
|---|---|
| `rimclip.scad` | Parametric model. OpenSCAD. Change `wire` if you use a different rod. |
| `rimclip.stl` | Triangle mesh of the assembled pose. Six separate volumes: jaw, arm, disc, pin, striker. They are captive in the design and not fused into one lump. |
| `rimclip_preview.png` | Render of that mesh. |
| `rimclip_drawing.svg` | Dimensioned sketch for a slide. |

OpenSCAD 2021 wrote the STL on 21 Nov 2026. A STEP solid was not exported: the tool on this machine writes a mesh. The `.scad` file is the editable CAD.
