// ─── synthwave · 100 BPM ───────────────────────────────────
// Signature tricks: driving 8th-note octave bass, big reverb on the snare,
// bright saw lead, 80s chord progression.

setcpm(100 / 4)

const chords = "<Am F C G>"

// drums: Linn-style kit, huge snare reverb
$: s("bd ~ bd ~").bank("LinnDrum").gain(1.1)
$: s("~ sd ~ sd").bank("LinnDrum").room(0.9).size(4).gain(0.9)
$: s("hh*8").bank("LinnDrum").gain(0.3)

// bass: 8th notes alternating root and octave
$: note("<a1 f1 c2 g1>")
  .struct("x*8")
  .add(note("0 12"))
  .s("sawtooth")
  .lpf(800)
  .decay(0.15).sustain(0.3)
  .gain(0.55)

// pad
$: chord(chords).voicing()
  .s("supersaw")
  .attack(0.1).release(0.5)
  .lpf(2000)
  .room(0.6)
  .gain(0.2)

// lead melody, two bars long, with a wide stereo delay
$: note("<[a4 ~ c5 e5] [d5 ~ c5 a4] [g4 ~ e4 g4] [b4 ~ a4 g4]>")
  .s("sawtooth")
  .lpf(3000)
  .attack(0.01).release(0.3)
  .delay(0.4).delaytime(0.45).delayfeedback(0.4)
  .room(0.5)
  .gain(0.25)
  .jux((x) => x.late(0.01))
