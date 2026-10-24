// ─── gamelan · Balinese gender wayang, slendro (synthesized) ──
// Gender wayang accompanies the shadow-puppet play: a quartet of 10-key
// metallophones with bamboo resonators, two pemade (lower) and two kantilan
// (an octave higher). Each player uses two mallets: the left hand plays the
// melody, the right hand plays interlocking kotekan.
//
// Balinese slendro: 5 nearly even steps, keys dong deng dung dang ding.
// Kotekan here is "nyog cag": polos and sangsih strictly alternate notes of
// one fast line, so each player only plays every other 16th.

const dong = 205 // Hz, lowest key of the pemade
const cents = [0, 235, 475, 710, 950] // dong deng dung dang ding
const hz = (k) => dong * 2 ** (Math.floor(k / 5) + cents[((k % 5) + 5) % 5] / 1200)
const ombak = slider(5, 0, 12, 0.5) // Hz between the paired instruments

const pair = (keys) => stack(freq(keys.fmap(hz)), freq(keys.fmap(hz)).add(freq(ombak)))
// bars over tuned bamboo: warm, long ring, damped by the next stroke of the same hand
const gender = (pat) => pat.s("sine").fm(0.7).fmh(2.756).fmdecay(0.25).fmsustain(0)
  .attack(0.003).decay(1.8).sustain(0.2).release(0.35)

setcpm(86 / 4)

// left hand: the melody, low octave
const melody = "<[2 ~ 1 ~ 3 ~ 2 ~] [4 ~ 3 ~ 2 ~ 1 ~] [2 ~ 3 ~ 4 ~ 6 ~] [5 ~ 4 ~ 2 ~ 1 ~]>"
// right hand: one 16th-note line, shifted to follow the melody each bar
const line = "7 6 7 8 7 6 5 6 7 8 9 8 7 6 5 6".add("<0 -1 1 -1>")

// pemade pair
$: gender(pair(melody)).gain(0.35)
$: gender(pair(line.mask("[1 0]*8"))).pan(0.3).gain(0.25)   // polos
$: gender(pair(line.mask("[0 1]*8"))).pan(0.7).gain(0.25)   // sangsih

// kantilan pair: the same parts an octave up, softer
$: gender(pair(melody.add(5))).gain(0.15)
$: gender(pair(line.add(5).mask("[1 0]*8"))).pan(0.2).gain(0.12)
$: gender(pair(line.add(5).mask("[0 1]*8"))).pan(0.8).gain(0.12)
