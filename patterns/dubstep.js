// ─── dubstep · 140 BPM half-time ───────────────────────────
// Signature tricks: snare on beat 3 (half-time feel), wobble bass made by
// sweeping a resonant filter at changing speeds.

setcpm(140 / 4)

// half-time beat: kick on 1, snare on 3, extra kick pushes the groove
$: s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~").bank("RolandTR909").gain(1.2)
$: s("~ ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~").bank("RolandTR909").room(0.3).gain(1.1)
$: s("hh*8").bank("RolandTR909").gain("[0.35 0.2]*4").degradeBy(0.1)

// wobble: .segment(16) retriggers the note every 16th so the filter can move;
// the number in .fast() is the wobble speed, changing each bar
$: note("<c1 c1 eb1 [g0 bb0]>")
  .s("sawtooth")
  .segment(16)
  .lpf(sine.range(100, 2200).fast("<4 8 2 [6 12]>"))
  .lpq(12)
  .shape(0.4)     // distortion
  .gain(0.45)

// sub bass under the wobble, so the low end stays solid
$: note("<c1 c1 eb1 [g0 bb0]>")
  .s("sine")
  .gain(0.6)

// eerie lead stab every other bar
$: note("<[~ c4 ~ eb4] ~>")
  .s("square")
  .lpf(2000)
  .delay(0.5).delaytime(0.214).delayfeedback(0.5)
  .room(0.6)
  .gain(0.2)
