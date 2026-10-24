// ─── strudel basics: mini-notation cheat sheet ─────────────
// Un-mute one line at a time (remove the leading `_`) and press Ctrl/Cmd+Enter.

//  "a b c"     sequence: events split the cycle evenly
//  "a*4"       repeat 4 times in the step
//  "[a b]"     group: squeeze several events into one step
//  "<a b c>"   alternate: one per cycle
//  "~"         rest
//  "a?"        play 50% of the time
//  "a(3,8)"    euclidean rhythm: 3 hits spread over 8 steps
//  "a, b"      play in parallel (stack)

$: s("bd sd bd sd")
_$: s("bd*2 [~ sd] hh*4")
_$: s("<bd sd> hh <cp [cp cp]>")
_$: s("bd(3,8), hh*8?, ~ cp")
_$: note("c3 e3 g3 <b3 a3>").s("piano")
_$: n("0 2 4 <6 7>").scale("D:dorian").s("gm_electric_guitar_muted")

// chord symbols: major 7th/9th are written with ^ ("C^7", "F^9"), not "maj7";
// unknown symbols are silently skipped
_$: chord("<Am7 D7 G^7 C^9>").voicing().s("gm_epiano1")

// faders: slider(value, min, max, step) draws a draggable control right in the code.
// Drag it while playing; no need to re-run
_$: s("hh*16").gain(slider(0.5, 0, 1)).lpf(slider(4000, 200, 10000, 100))
