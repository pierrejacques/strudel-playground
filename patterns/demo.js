// ─── strudel playground demo ───────────────────────────────
// Ctrl/Cmd+Enter: play / apply changes · Ctrl/Cmd+.: stop
// Each `$:` line is its own track; put `_` before `$:` to mute it.
// Reference: https://strudel.cc/learn

setcpm(124 / 4) // 124 BPM, 4 beats per cycle

// kick on every beat, 909 style
$: s("bd*4").bank("RolandTR909").gain(1.1)

// claps on 2 and 4, open hats on the offbeat, shuffling closed hats
$: s("~ cp ~ cp").bank("RolandTR909").room(0.3)
$: s("[~ oh]*4").bank("RolandTR909").gain(0.5)
$: s("hh*16").bank("RolandTR909")
  .gain(perlin.range(0.2, 0.5))   // humanized velocity
  .pan(sine.range(0.3, 0.7))

// acid bassline: notes from a scale, filter swept by a slow sine
$: n("<0 0 3 5> [0 7]*2 ~ [5 3]")
  .scale("A1:minor")
  .s("sawtooth")
  .lpf(sine.range(300, 2400).slow(8))
  .lpq(12)
  .decay(0.15).sustain(0)
  .gain(0.6)

// pad chords, one per bar
$: chord("<Am7 F^7 C^7 G7>")
  .voicing()
  .s("supersaw")
  .attack(0.3).release(1)
  .lpf(1800)
  .gain(0.25)
  .room(0.8)

// arpeggio lead with delay; sometimes jumps an octave up
_$: n("0 2 4 7 9 7 4 2".fast(2))
  .scale("A4:minor pentatonic")
  .s("triangle")
  .sometimes(x => x.add(note(12)))
  .delay(0.4).delaytime(0.1875).delayfeedback(0.5)
  .jux(rev)
  .gain(0.3)
