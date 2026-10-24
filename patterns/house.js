// ─── deep house · 122 BPM ──────────────────────────────────
// Signature tricks: swung hats, electric-piano chord stabs, syncopated bass,
// and a "sidechain" pump faked with a gain envelope on the pad.

setcpm(122 / 4)

// drums (808 kit), swung slightly with .swingBy
$: s("bd*4").bank("RolandTR808").gain(1.2)
$: s("~ cp ~ cp").bank("RolandTR808").room(0.3).gain(0.8)
$: s("[~ oh]*4").bank("RolandTR909").gain(0.35)
$: s("hh*16").bank("RolandTR808")
  .gain(perlin.range(0.15, 0.4))
  .degradeBy(0.2)          // randomly drop 20% of hits
  .swingBy(1 / 6, 8)

// chord stabs: minor 9ths on the offbeats, the classic deep-house color
$: chord("<Am9 Dm9 Gm9 Cm9>/2").voicing()
  .struct("~ x ~ ~ ~ x ~ [~ x]")
  .s("gm_epiano1")
  .room(0.4)
  .gain(0.6)

// bass: root note on syncopated 8ths
$: note("<a1 d2 g1 c2>/2")
  .struct("x ~ ~ x ~ x ~ ~")
  .s("sawtooth")
  .lpf(350)
  .decay(0.25).sustain(0.2)
  .gain(0.8)

// soft pad, ducked on every kick (the volume dips then swells back)
$: chord("<Am9 Dm9 Gm9 Cm9>/2").voicing()
  .s("supersaw")
  .segment(16)
  .gain(saw.range(0, 0.15).fast(4))
  .lpf(1200)
  .room(0.7)
