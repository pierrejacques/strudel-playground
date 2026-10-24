// ─── gamelan · Javanese ladrang, pelog pathet barang (soundbank) ──
// A ladrang is a longer, statelier form than the lancaran: 32 beats per gong.
//   kenong every 8 beats · kempul halfway between kenongs (not in the first)
//   kethuk on beat 2 of every gatra, kempyang ticking on beats 1 and 3
//
// Pelog has 7 pitches with uneven steps; each pathet (mode) uses a subset.
// Pathet barang uses 2 3 5 6 7 and avoids 1. You can't just swap in
// .bank("slendro"): slendro instruments have 5 keys and no 7 at all.
// The two tunings are really two different sets of instruments.

await samples('/samples/java/strudel.json')

const scale = [1, 2, 3, 4, 5, 6, 7] // keys on each pelog instrument
const play = (pat) => n(pat.fmap((x) => (x > 10 ? scale.length : 0) + scale.indexOf(x % 10)))

setcpm(46 / 4) // irama dadi: slow and spacious, the decorating parts play denser

// 8 gatra = one gongan; the goal notes (seleh) are 7 2 6 6 6 3 2 6
const balungan = "<[6 7 2 7] [6 5 3 2] [5 6 7 6] [3 2 7 6] [2 3 5 6] [7 6 5 3] [6 5 3 2] [3 2 7 6]>"

$: play(balungan).s("demung").bank("pelog").gain(0.5)
$: play(balungan).s("saron").bank("pelog").gain(0.45)
$: play(balungan).s("slenthem").bank("pelog").gain(0.7)
// peking runs ahead, each balungan note twice
$: play(balungan.ply(2)).s("peking").bank("pelog").gain(0.28).pan(0.65)

// bonang gembyang: octave pairs (both rows at once) leading into each goal note
$: play("<7 2 6 6 6 3 2 6>")
  .layer((x) => x, (x) => x.add(n(7)))   // + 7 keys = same pitch on the upper row
  .struct("~ [~ x] ~ [x x]")
  .s("bonang").bank("pelog")
  .gain(0.3)
  .pan(0.35)

// colotomic structure
$: s("kempyang").bank("pelog").struct("x ~ x ~").gain(0.3)
$: s("kethuk").bank("pelog").struct("~ x ~ ~").gain(0.5)
$: play("<~ [~ ~ ~ 2] ~ [~ ~ ~ 6] ~ [~ ~ ~ 3] ~ [~ ~ ~ 6]>").s("kenong").bank("pelog").gain(0.5)
$: play("<~ ~ [~ ~ ~ 6] ~ [~ ~ ~ 6] ~ [~ ~ ~ 2] ~>").s("kempul").bank("pelog").gain(0.6)
$: s("gong").bank("pelog").struct("<~!7 [~ ~ ~ x]>").gain(0.9)

// kendhang: sparse, mostly marking the ends of phrases
$: n("<[0 ~ ~ ~] [~ ~ 3 1] [~ ~ 2 ~] [3 1 ~ 0]>").s("kendhang").bank("pelog").gain(0.6)
