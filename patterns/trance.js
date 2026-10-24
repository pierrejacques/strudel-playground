// ─── trance · 138 BPM ──────────────────────────────────────
// Signature tricks: rolling offbeat bass, gated supersaw chords, chord arpeggio.
// Try: mute the kick + bass (`_$:`) for a breakdown, then bring them back.

setcpm(138 / 4)

const chords = "<Am F C G>"

// drums: four-on-the-floor, offbeat open hats, claps on 2 & 4
$: s("bd*4").bank("RolandTR909").gain(1.1)
$: s("[~ oh]*4").bank("RolandTR909").gain(0.45)
$: s("~ cp ~ cp").bank("RolandTR909").room(0.4)
$: s("hh*16").bank("RolandTR909").gain("[0.35 0.15]*8")

// rolling bass: three 16ths after every kick, following the chord root
$: note("<a1 f1 c2 g1>")
  .struct("[~ x x x]*4")
  .s("sawtooth")
  .lpf(500).lpq(4)
  .decay(0.1).sustain(0)
  .gain(0.7)

// gated pad: the rhythm in .struct() chops a sustained supersaw chord
$: chord(chords).voicing()
  .struct("x x ~ x x ~ x x x ~ x x ~ x x ~")
  .s("supersaw")
  .lpf(sine.range(800, 4000).slow(16))   // slow filter build over 16 bars
  .decay(0.12).sustain(0.3)
  .gain(0.3)
  .room(0.5)

// arpeggio: walks up and down the notes of the current chord, an octave up
$: chord(chords).voicing()
  .arp("0 1 2 3 2 1 0 1 2 3 2 1 0 1 2 3")
  .add(note(12))
  .s("square")
  .lpf(3000)
  .decay(0.08).sustain(0)
  .delay(0.5).delaytime(0.326).delayfeedback(0.4)   // dotted 8th at 138 BPM
  .room(0.6)
  .gain(0.2)
