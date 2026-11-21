// Rimclip — stainless rim clip for a pot of milk.
// Units: millimetres. Origin: middle of the rim slot, +Z up, +X toward the centre of the pot.
// Pose is the assembled design for a 14 cm pot and 500 mL (milk surface about 67 mm below the rim).
// This is a design model. It has not been bent, printed, or boiled.
//
// Do not make this in plastic. A gas flame will melt it. Use 2.5–3 mm stainless wire (SS304)
// and a 1.2 mm notched stainless disc. The pin is captive so the disc and the clapper stay on the clip.

wire = 3.0;
$fn = 48;

module rod(a, b, d = wire) {
  hull() {
    translate(a) sphere(d = d);
    translate(b) sphere(d = d);
  }
}

module jaw() {
  // Spring clip. Slot is 2.6 mm, deep enough for a rolled steel rim.
  w = 18;
  t = 1.8;
  gap = 2.6;
  translate([-t - gap / 2, -w / 2, -16]) cube([t, w, 28]);          // outside the pot
  translate([-gap / 2 - t, -w / 2, 10]) cube([gap + 2 * t, w, t]);  // over the rim
  translate([gap / 2, -w / 2, -8]) cube([t, w, 18 + t]);            // inside the pot
}

module arm() {
  // Down the inside wall, then in over the milk. Centres of the wire:
  a = [2.2, 0, 6];
  b = [16, 0, 6];
  c = [16, 0, -67];
  d = [30, 0, -67];
  rod(a, b);
  rod(b, c);
  rod(c, d);
  // Yoke out to two cheeks. The pin through the cheeks also passes through the disc.
  rod(d, [52, 10, -67]);
  rod(d, [52, -10, -67]);
  for (s = [-1, 1]) translate([52, s * 10, -67]) rotate([90, 0, 0]) difference() {
    cylinder(h = 4, d = 8, center = true);
    cylinder(h = 6, d = 3.2, center = true);
  }
  // Anvil the loose head taps. Fixed to the arm.
  translate([34, 9, -58]) cube([5, 4, 6], center = true);
}

module disc() {
  // Lies in the milk. Hole axis is the pin (along Y), so a shake of the surface tilts the disc.
  translate([52, 0, -67]) difference() {
    cylinder(h = 1.2, d = 40, center = true);
    rotate([90, 0, 0]) cylinder(h = 8, d = 3.2, center = true);
    for (i = [0:5]) rotate([0, 0, i * 60]) translate([15.5, 0, 0]) cube([9, 1.8, 4], center = true);
  }
}

module pin_and_clapper() {
  // Captive pin through both cheeks and the disc.
  translate([52, 0, -67]) rotate([90, 0, 0]) cylinder(h = 28, d = 2.2, center = true);
  // Loose striker, drawn just short of the anvil. It is free on the pin and taps when the disc shakes.
  rod([52, 6, -67], [36, 9, -61], 2.2);
  translate([35, 9, -60.2]) sphere(d = 4.5);
}

jaw();
arm();
disc();
pin_and_clapper();
