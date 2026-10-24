// ─── gamelan · Javanese lancaran, slendro (synthesized) ────
// No samples: every pitch is computed in Hz from the tuning table below and
// played on FM synth voices shaped to sound like bronze.
//
// Slendro has 5 notes per octave with nearly equal steps of ~240 cents
// (a piano semitone is 100), so it doesn't fit Western notes at all.
// Every gamelan set is tuned differently; this table is one example. Change
// the numbers and the whole orchestra is retuned.
//
// Melodies use Javanese cipher notation (kepatihan): 1 2 3 5 6, no 4 in slendro.
// High octave (dot above) = 11 12 13 15 16, low octave (dot below) = -1 -2 -3 -5 -6.

const nada1 = 268 // Hz of pitch 1
const cents = { 1: 0, 2: 236, 3: 474, 5: 714, 6: 950 }
const hz = (x) => nada1 * 2 ** ((x > 10 ? 1 : x < 0 ? -1 : 0) + cents[Math.abs(x) % 10] / 1200)
const tune = (pat) => freq(pat.fmap(hz)) // cipher numbers -> frequencies

setcpm(64 / 4) // one cycle = one gatra (4 balungan beats); 4 gatra = one gongan

// balungan: the core melody, one note per beat; the last note of each gatra is its goal (seleh)
const balungan = "<[3 5 3 2] [6 5 3 2] [3 5 6 5] [3 2 1 6]>"

// ── melody instruments ───────────────────────────────────

// saron barung: plays the balungan
$: tune(balungan)
  .s("sine").fm(2.5).fmh(2.756).fmdecay(0.15).fmsustain(0.1)
  .decay(0.9).sustain(0).release(0.6)
  .gain(0.45)

// slenthem: the balungan an octave lower, soft and long
$: tune(balungan).mul(freq(0.5))
  .s("sine").fm(0.6).fmh(2.756).fmdecay(0.3).fmsustain(0)
  .attack(0.01).decay(2).sustain(0).release(1.5)
  .gain(0.4)

// saron peking: each balungan note doubled, high octave
$: tune(balungan.add(10).ply(2))
  .s("sine").fm(2).fmh(2.756).fmdecay(0.08).fmsustain(0.1)
  .decay(0.4).sustain(0).release(0.3)
  .gain(0.22)
  .pan(0.65)

// bonang barung: kettle gongs elaborating each gatra in pairs (a simplified mipil)
$: tune("<[3 5 3 5 3 2 3 2] [6 5 6 5 3 2 3 2] [3 5 3 5 6 5 6 5] [3 2 3 2 1 6 1 6]>")
  .s("sine").fm(1.2).fmh(2).fmdecay(0.2).fmsustain(0.2)
  .decay(0.8).sustain(0).release(0.6)
  .gain(0.25)
  .pan(0.35)

// ── colotomic instruments: the gongs that mark the form ──

// kethuk: small damped kettle on beats 1 and 3
$: tune("-2 ~ -2 ~")
  .s("sine").fm(1).fmh(1.5).decay(0.1).sustain(0)
  .gain(0.4)

// kenong: big kettle, plays the seleh of each gatra on beat 4
$: tune("<[~ ~ ~ 2] [~ ~ ~ 2] [~ ~ ~ 5] [~ ~ ~ 6]>")
  .s("sine").fm(0.8).fmh(2).fmdecay(0.4).fmsustain(0.1)
  .decay(2.5).sustain(0).release(2)
  .gain(0.35)

// kempul: hanging gong on beat 2 of gatra 2, 3, 4 (skipped in the first: "wela")
$: tune("<~ [~ -2 ~ ~] [~ -5 ~ ~] [~ -6 ~ ~]>").mul(freq(0.5))
  .s("sine").fm(0.5).fmh(1.41)
  .decay(3).sustain(0).release(2)
  .gain(0.5)

// gong ageng: the end of the gongan. Two sines 0.7 Hz apart make it "breathe" (ombak)
$: s("sine").freq(hz(-6) / 4)
  .superimpose((x) => x.freq(hz(-6) / 4 + 0.7))
  .struct("<~ ~ ~ [~ ~ ~ x]>")
  .attack(0.03).decay(7).sustain(0).release(4)
  .gain(0.6)

// kendhang: drum keeping the tempo. Low "dhung" and slapped "tak"
$: s("sine").freq(85).struct("[x ~ ~ x] [~ ~ x ~]")
  .decay(0.18).sustain(0)
  .gain(0.7)
$: s("brown").struct("~ [~ x] ~ x").decay(0.05).sustain(0).lpf(2500).gain(0.35)
