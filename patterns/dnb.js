// ─── drum & bass · 174 BPM ─────────────────────────────────
// Signature tricks: two-step beat, chopped breakbeat, detuned "reese" bass.
// Each cycle is one bar split into 16 steps (16th notes).

setcpm(174 / 4)

// two-step: kick on 1 and the "and" of 3, snare on 2 and 4
$: s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~").bank("RolandTR909").gain(1.1)
$: s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").bank("RolandTR909").room(0.2)
$: s("hh*8").bank("RolandTR909").gain("[0.4 0.2]*4")

// breakbeat: the Amen break (2 bars) stretched to fit 2 cycles at our tempo,
// cut into 32 slices, some slices doubled for stutters
$: s("brk")
  .loopAt(2)
  .chop(32)
  .sometimesBy(0.15, (x) => x.ply(2))
  .gain(0.5)
  .hpf(300)   // keep the low end for kick + bass

// reese bass: two saws slightly out of tune, filter moving slowly
$: note("<e1 e1 g1 [d1 c1]>")
  .s("sawtooth")
  .superimpose((x) => x.add(note(0.15)))
  .segment(8)
  .lpf(sine.range(200, 900).slow(4))
  .lpq(6)
  .gain(0.45)

// atmospheric pad
$: chord("<Em9 C^9>/2").voicing()
  .s("gm_pad_warm")
  .room(0.8)
  .gain(0.35)
