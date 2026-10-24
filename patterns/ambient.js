// ─── ambient · 60 BPM ──────────────────────────────────────
// Signature tricks: slow attacks and long releases, lots of reverb and delay,
// random sparse melody, noise wash. No drums.

setcpm(60 / 4)

// evolving pad: each chord lasts 2 bars and fades in and out
$: chord("<C^9 Am9 F^9 G6>/2").voicing()
  .s("supersaw")
  .attack(2).release(4)
  .lpf(sine.range(400, 1200).slow(32))
  .room(0.9).size(8)
  .gain(0.25)

// random notes from a pentatonic scale, most of them skipped
$: n(irand(10).segment(8))
  .scale("C4:major pentatonic")
  .s("gm_vibraphone")
  .degradeBy(0.6)
  .delay(0.6).delaytime(0.5).delayfeedback(0.6)
  .room(0.9)
  .pan(rand)
  .gain(0.5)

// sub drone on the root
$: note("<c2 a1 f1 g1>/2")
  .s("sine")
  .attack(1).release(3)
  .gain(0.35)

// filtered pink-noise wash, like distant waves
$: s("pink")
  .attack(4).release(4)
  .lpf(sine.range(300, 1500).slow(16))
  .gain(0.06)
