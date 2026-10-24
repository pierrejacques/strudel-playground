// ─── lo-fi hip hop · 84 BPM ────────────────────────────────
// Signature tricks: lazy swung drums, jazzy 9th chords on Rhodes,
// bit-crushing and low-pass to sound like an old sampler.

setcpm(84 / 4)

// boom-bap drums with heavy swing
$: s("bd ~ ~ bd ~ ~ bd ~, ~ ~ sd ~ ~ ~ sd ~")
  .bank("RolandTR808")
  .swingBy(1 / 5, 4)
  .crush(8)     // reduce bit depth for grit
  .lpf(3500)
  .gain(1.1)
$: s("hh*8").bank("RolandTR808")
  .swingBy(1 / 5, 4)
  .gain(perlin.range(0.2, 0.45))
  .lpf(5000)

// jazzy chords, slightly late and soft like a human player
$: chord("<Dm9 G13 C^9 A7b13>").voicing()
  .s("gm_epiano1")
  .struct("x ~ ~ [~ x] ~ ~ x ~")
  .late(0.02)
  .lpf(2000)
  .room(0.4)
  .gain(0.6)

// upright bass
$: note("<d2 g1 c2 a1>")
  .struct("x ~ ~ ~ ~ x ~ ~")
  .s("gm_acoustic_bass")
  .gain(0.8)

// vinyl hiss
$: s("white").hpf(5000).gain(0.015)
