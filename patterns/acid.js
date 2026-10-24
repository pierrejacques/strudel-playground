// ─── acid house · 130 BPM ──────────────────────────────────
// The TB-303 sound: one saw voice through a resonant low-pass filter, with
// a filter envelope "plucking" each note, accents, octave jumps and distortion.
// The fun part is turning the knobs: try different values for the cutoff
// range, .lpq (resonance) and .lpenv (envelope amount) while it plays.

setcpm(130 / 4)

// 909 drums
$: s("bd*4").bank("RolandTR909").gain(1.15)
$: s("~ cp ~ cp").bank("RolandTR909").gain(0.7)
$: s("[~ oh]*4").bank("RolandTR909").gain(0.4)
$: s("hh*16").bank("RolandTR909").gain("[0.35 0.2 0.25 0.2]*4")

// the 303 line: 16 steps, ~ are rests, notes shifted by octave in <...> each bar
$: note("c2 c2 c3 c2 ~ eb2 c2 [c3 bb2] c2 ~ g2 c2 ~ c3 eb3 ~")
  .add(note("<0 0 5 -2>"))           // move the line around: C, C, F, Bb
  .s("sawtooth")
  .lpf(sine.range(250, 1400).slow(16))   // the "cutoff" knob, swept over 16 bars
  .lpq(18)                           // resonance: high = squelchy
  .lpenv("<4 4 6 3>")                // how far the envelope opens the filter
  .lpattack(0.005).lpdecay(0.12).lpsustain(0)
  .decay(0.2).sustain(0.4)
  .gain("1 .6 .8 .6 .6 1 .6 .8 .6 .6 1 .6 .6 .8 1 .6".mul(0.5))   // accents
  .shape(0.5)                        // 303s are almost always driven hard
  .delay(0.25).delaytime(0.346).delayfeedback(0.3)               // dotted 8th

// second 303 an octave up, square wave, enters every other 8 bars
$: note("~ c4 ~ ~ eb4 ~ ~ g4".fast(2))
  .add(note("<0 0 5 -2>"))
  .s("square")
  .lpf(perlin.range(600, 2500))
  .lpq(14).lpenv(3).lpdecay(0.08).lpsustain(0)
  .decay(0.1).sustain(0)
  .mask("<0!8 1!8>")
  .room(0.4)
  .gain(0.25)

// stab chord on the offbeat every 2 bars, the classic rave hit
$: chord("<Cm7 ~>").voicing()
  .struct("~ ~ x ~")
  .s("supersaw")
  .decay(0.2).sustain(0)
  .room(0.7)
  .gain(0.3)
