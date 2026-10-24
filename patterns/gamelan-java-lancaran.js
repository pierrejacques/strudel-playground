// ─── gamelan · Javanese lancaran, slendro (soundbank) ──────
// The same piece as gamelan-java-lancaran-synth, played on our sampled gamelan
// (public/samples/java, made by `npm run make:gamelan`). Compare the two!
//
// The bank is a Javanese double set: every instrument exists in slendro and in
// pelog. Pick the tuning with .bank("slendro") or .bank("pelog").
// Each instrument has one row of keys, so n() is just "which key": the play()
// helper below turns cipher numbers (1 2 3 5 6) into key positions.
// 11 12 13 15 16 = the bonang's upper row.

await samples('/samples/java/strudel.json')

const scale = [1, 2, 3, 5, 6] // the keys on each slendro instrument, low to high
const play = (pat) => n(pat.fmap((x) => (x > 10 ? scale.length : 0) + scale.indexOf(x % 10)))

setcpm(64 / 4) // one cycle = one gatra (4 beats); 4 gatra = one gongan

const balungan = "<[3 5 3 2] [6 5 3 2] [3 5 6 5] [3 2 1 6]>"

// ── the saron family plays the balungan in three octaves ──
$: play(balungan).s("demung").bank("slendro").gain(0.55)
$: play(balungan).s("saron").bank("slendro").gain(0.5)
$: play(balungan.ply(2)).s("peking").bank("slendro").gain(0.3).pan(0.65)
$: play(balungan).s("slenthem").bank("slendro").gain(0.7)

// bonang barung: pairs elaborating each gatra, upper row on the goal note
$: play("<[3 5 3 5 3 2 3 12] [6 5 6 5 3 2 3 12] [3 5 3 5 6 5 6 15] [3 2 3 2 1 6 1 16]>")
  .s("bonang").bank("slendro")
  .gain(0.35)
  .pan(0.35)

// ── colotomic gongs ──
$: s("kethuk").bank("slendro").struct("x ~ x ~").gain(0.55)
$: play("<[~ ~ ~ 2] [~ ~ ~ 2] [~ ~ ~ 5] [~ ~ ~ 6]>").s("kenong").bank("slendro").gain(0.5)
$: play("<~ [~ 2 ~ ~] [~ 5 ~ ~] [~ 6 ~ ~]>").s("kempul").bank("slendro").gain(0.6)
$: s("gong").bank("slendro").struct("<~ ~ ~ [~ ~ ~ x]>").gain(0.9)

// kendhang: 0 dhah (deep), 1 dhung (open), 2 tak (slap), 3 ket (damped)
$: n("[0 ~ 3 1] [~ 2 1 3]").s("kendhang").bank("slendro").gain("[0.8 0.3 0.6 0.4]*2")
