// ─── gamelan · Balinese baleganjur (soundbank) ─────────────
// Marching gamelan for processions and contests: almost all percussion.
// Its power comes from many pairs of big hand cymbals (ceng-ceng kopyak)
// playing interlocking parts, over a steady 8-beat gong cycle.
//   0 = damped "tek", 1 = open crash on the kopyak
// Uses our Bali bank (public/samples/bali, made by `npm run make:gamelan`).

await samples('/samples/bali/strudel.json')

setcpm(132 / 4) // one cycle = 4 beats; 2 cycles = one gong cycle

// every 4th bar ends in an angsel: the cymbals cut out and everyone hits together
const angsel = "<1 1 1 [1 1 1 0]>"

// three interlocking kopyak parts: none is a rhythm by itself, the pattern is in the sum
$: n("1 ~ 0 ~ 0 ~ 1 ~ 1 ~ 0 ~ 0 ~ 1 ~").s("kopyak").bank("bali").mask(angsel).pan(0.25).gain(0.45)
$: n("~ 0 ~ 0 ~ 1 ~ 0 ~ 0 ~ 1 ~ 0 ~ 0").s("kopyak").bank("bali").mask(angsel).pan(0.75).gain(0.45)
$: n("~ ~ 1 ~ ~ ~ ~ 1 ~ ~ 1 ~ ~ ~ ~ 1").s("kopyak").bank("bali").mask(angsel).pan(0.5).gain(0.35)

// the angsel hit: kopyak, reyong and drums together
$: n("<~ ~ ~ [~ ~ ~ [1 ~ 1 1]]>").s("kopyak").bank("bali").gain(0.6)
$: n("<~ ~ ~ [~ ~ ~ [[0,2,5,7] ~ [0,2,5,7] [0,2,5,7]]]>").s("reyong").bank("bali").gain(0.4)

// ponggang: two kettles alternating, the only melody in the band
$: n("[0 ~ 2 ~]*2").s("reyong").bank("bali").mask(angsel).gain(0.35)

// gongs: gong at the end of the cycle, kempur halfway, bebende off the beat
$: s("gong").bank("bali").struct("<~ [~ ~ ~ x]>").gain(0.9)
$: s("kempur").bank("bali").struct("<[~ ~ ~ x] ~>").gain(0.6)
$: s("bebende").bank("bali").struct("<[~ ~ x ~] [~ x ~ ~]>").gain(0.45)
$: s("kempli").bank("bali").struct("x*4").gain(0.4)   // the marching beat

// kendang pair: wadon (low, dag) and lanang (high, tut/ka) interlock
$: n("0 ~ ~ 2 ~ ~ 0 ~ 2 ~ 0 ~ ~ 2 ~ ~").s("kendang").bank("bali").mask(angsel).gain(0.8)
$: n("~ 3 1 ~ 3 1 ~ 3 ~ 1 ~ 3 1 ~ 3 1").s("kendang").bank("bali").mask(angsel).gain(0.45).pan(0.6)
$: n("<~ ~ ~ [~ ~ ~ [0 ~ 0 0]]>").s("kendang").bank("bali").gain(0.9)
