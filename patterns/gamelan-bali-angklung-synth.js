// ─── gamelan · Balinese gamelan angklung, 4-tone slendro (synthesized) ──
// A small, bright, old ensemble played at temple ceremonies. Its scale has only
// 4 tones (keys dong deng dung dang), so every melody circles tightly.
// Kotekan here is "norot": polos plays the melody note, sangsih answers with
// the key above it, in strict alternation.

const dong = 410 // Hz
const cents = [0, 250, 490, 720] // only 4 tones
const hz = (k) => dong * 2 ** (Math.floor(k / 4) + cents[((k % 4) + 4) % 4] / 1200)
const ombak = 6

const pair = (keys) => stack(freq(keys.fmap(hz)), freq(keys.fmap(hz)).add(freq(ombak)))
const gangsa = (pat) => pat.s("sine").fm(2.2).fmh(2.756).fmdecay(0.08).fmsustain(0.05)
  .decay(0.9).sustain(0).release(0.5)

setcpm(126 / 4)

// pokok: one note per beat; 4 cycles = one gong (kempur) cycle
const pokok = "<[0 1 2 1] [2 3 2 1] [0 3 2 0] [1 2 1 0]>"

// norot kotekan
$: gangsa(pair(pokok.struct("[x ~ x ~]*4"))).pan(0.3).gain(0.3)            // polos
$: gangsa(pair(pokok.add(1).struct("[~ x ~ x]*4"))).pan(0.7).gain(0.3)     // sangsih

// calung + jegogan: the pokok an octave down, and the goal notes two down
$: gangsa(pair(pokok.add(-4))).gain(0.3)
$: pair("<[~ ~ ~ 1] [~ ~ ~ 1] [~ ~ ~ 0] [~ ~ ~ 0]>".add(-8))
  .s("sine").fm(0.5).fmh(2.756).decay(2.5).sustain(0).release(1.5).gain(0.4)

// reyong: 4 kettles, syncopated melody in the high octave
$: freq(pokok.add(4).struct("x ~ ~ x ~ ~ x ~").fmap(hz))
  .s("sine").fm(1.2).fmh(1.99).decay(0.5).sustain(0).release(0.3).gain(0.15)

// kempur ends each cycle; kempli keeps the beat
$: s("sine").freq(92).superimpose((x) => x.freq(93.5)).struct("<~ ~ ~ [~ ~ ~ x]>")
  .attack(0.02).decay(4).sustain(0).release(2).gain(0.45)
$: s("sine").freq(700).fm(1).fmh(1.52).struct("~ x ~ x").decay(0.07).sustain(0).gain(0.3)

// ceng-ceng and small kendang
$: s("white").struct("[x x x x]*4").hpf(7000).decay(0.04).sustain(0).gain("[0.25 0.1 0.18 0.1]*4")
$: s("sine").freq(140).struct("[x ~ ~ x] [~ ~ x ~] [x ~ ~ x] [~ x ~ ~]").decay(0.12).sustain(0).gain(0.5)

// bamboo angklung: the shaken rattles the ensemble is named after (un-mute to add)
_$: freq(pokok.add(8).fmap(hz)).s("triangle").ply(6).decay(0.03).sustain(0).gain(0.12)
