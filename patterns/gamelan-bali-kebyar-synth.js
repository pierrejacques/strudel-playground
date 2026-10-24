// ─── gamelan · Balinese gong kebyar, pelog selisir (synthesized) ──
// The same piece as gamelan-bali-kebyar, with no samples: pitches are
// computed in Hz and played on FM voices. Compare the two!
//
// The ombak (shimmer between paired instruments) is a live fader: drag the
// slider that appears after `slider(` while it plays. At 0 the pairs are in
// unison and the sound goes flat and dead. Around 5–8 Hz is the kebyar sound.

const ding = 318 // Hz
const cents = [0, 120, 265, 670, 785] // ding dong deng dung dang
const hz = (k) => ding * 2 ** (Math.floor(k / 5) + cents[((k % 5) + 5) % 5] / 1200)
const ombak = slider(7, 0, 15, 0.5) // Hz the pengisep is tuned above the pengumbang

// pengumbang + pengisep: the same line on two instruments, ombak Hz apart
const pair = (keys) => stack(freq(keys.fmap(hz)), freq(keys.fmap(hz)).add(freq(ombak)))
const gangsa = (pat) => pat.s("sine").fm(2).fmh(2.756).fmdecay(0.12).fmsustain(0.05)
  .decay(1.4).sustain(0).release(0.9)

setcpm(112 / 4)

const pokok = "<[1 2 4 3] [2 4 3 0] [1 0 2 4] [3 2 1 0]>"
// kotekan telu: 3 neighbouring keys; polos takes the lower two, sangsih the upper two
const kotekan = "1 2 0 1 2 0 1 2 1 0 2 1 0 2 0 1"
const angsel = "<1 1 1 [1 1 1 0]>"

$: gangsa(pair(kotekan.filterValues((v) => v < 2).add(pokok))).mask(angsel).pan(0.3).gain(0.3)
$: gangsa(pair(kotekan.filterValues((v) => v > 0).add(pokok))).mask(angsel).pan(0.7).gain(0.3)

// calung: the pokok an octave up
$: gangsa(pair(pokok.add(5))).gain(0.2)

// jegogan: two octaves down, goal notes only
$: pair("<[~ ~ ~ 3] [~ ~ ~ 0] [~ ~ ~ 4] [~ ~ ~ 0]>".add(-10))
  .s("sine").fm(0.5).fmh(2.756).decay(3).sustain(0).release(2).gain(0.45)

// reyong: kettle-gong chord hits in the angsel
$: freq("[5,7,10,12]".fmap(hz))
  .struct("<~ ~ ~ [~ ~ ~ [x ~ x x]]>")
  .s("sine").fm(1.2).fmh(1.99).decay(0.8).sustain(0).release(0.5).gain(0.2)

// gongs: two close sines beat slowly, like a real gong's "breath"
$: s("sine").freq(41).superimpose((x) => x.freq(41.8)).struct("<x ~ ~ ~>")
  .attack(0.03).decay(7).sustain(0).release(3).gain(0.6)
$: s("sine").freq(83).superimpose((x) => x.freq(84.6)).struct("<~ ~ x ~>")
  .attack(0.02).decay(4).sustain(0).release(2).gain(0.4)
$: s("sine").freq(620).fm(1).fmh(1.52).struct("x*4").decay(0.08).sustain(0).gain(0.3) // kempli

// ceng-ceng: bright noise, open on the angsel accents
$: s("white").struct("<[x x x x]*4 [x x x x]*4 [x x x x]*4 [[x x x x]*3 ~]>")
  .hpf(7000).decay(0.04).sustain(0).gain("[0.3 0.12 0.2 0.12]*4")
$: s("white").struct("<~ ~ ~ [~ ~ ~ [x ~ x x]]>").hpf(4000).decay(0.4).sustain(0).gain(0.25)

// kendang: low "dag", high "tut", slapped "pek"
$: s("sine").freq(75).struct("[x ~ ~ ~] [~ ~ ~ x] [~ x ~ ~] [~ ~ x ~]").decay(0.2).sustain(0).gain(0.7)
$: s("sine").freq(170).struct("[~ ~ ~ ~] [x ~ ~ ~] [~ ~ ~ ~] [x ~ ~ ~]").decay(0.12).sustain(0).gain(0.5)
$: s("white").struct("[~ ~ x ~]*4").lpf(3000).decay(0.03).sustain(0).gain(0.35)
