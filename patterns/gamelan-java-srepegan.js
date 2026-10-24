// ─── gamelan · Javanese srepegan, slendro (soundbank) ──────
// Fast, driving music from wayang kulit (shadow puppet theatre), played
// during fights and journeys. Compared to the lancaran the gongs are dense:
//   kenong on every 2nd beat · kempul with the kenong on beat 2
//   gong suwukan (the smaller gong) every 2 gatra · gong ageng every 8

await samples('/samples/java/strudel.json')

const scale = [1, 2, 3, 5, 6]
const play = (pat) => n(pat.fmap((x) => (x > 10 ? scale.length : 0) + scale.indexOf(x % 10)))

setcpm(118 / 4)

const balungan = "<[2 1 2 1] [3 2 3 2] [5 3 5 3] [6 5 3 2] [5 6 5 6] [1 6 1 6] [5 3 6 5] [3 2 1 6]>"

$: play(balungan).s("demung").bank("slendro").gain(0.55)
$: play(balungan).s("saron").bank("slendro").gain(0.5)
$: play(balungan.ply(2)).s("peking").bank("slendro").gain(0.3).pan(0.65)
$: play(balungan).s("slenthem").bank("slendro").gain(0.6)

// bonang: doubling the balungan, jumping to the upper row every other beat
$: play(balungan.ply(2).add("[0 10]*4"))
  .s("bonang").bank("slendro")
  .gain(0.3)
  .pan(0.35)

// colotomic: kenong takes whatever balungan note falls on beats 2 and 4
$: s("kethuk").bank("slendro").struct("x ~ x ~").gain(0.5)
$: play(balungan).struct("~ x ~ x").s("kenong").bank("slendro").gain(0.5)
$: play(balungan).struct("~ x ~ ~").s("kempul").bank("slendro").gain(0.5)
$: s("suwukan").bank("slendro").struct("<~ [~ ~ ~ x]>").gain(0.7)
$: s("gong").bank("slendro").struct("<~!7 [~ ~ ~ x]>").gain(0.9)

// kendhang: busy and driving, accents push the dancers/puppets
$: n("[0 3 2 3] [1 3 2 2] [0 3 2 3] [1 2 0 3]")
  .s("kendhang").bank("slendro")
  .gain("[0.8 0.25 0.6 0.3]*4")
