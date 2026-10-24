# Strudel handbook

The essential, most-used parts of Strudel, grouped by what you're trying to do.
Every name and example here was checked against the version this repo uses (`@strudel/repl` 1.3).
For the full reference see https://strudel.cc/learn.

- [How code is shaped](#how-code-is-shaped)
- [Mini-notation](#mini-notation-inside-quotes)
- [Sounds](#sounds)
- [Pitch](#pitch)
- [Time](#time)
- [Structure and rhythm](#structure-and-rhythm)
- [Randomness and variation](#randomness-and-variation)
- [Layering](#layering)
- [Signals](#signals-continuous-values)
- [Sample manipulation](#sample-manipulation)
- [Volume and space](#volume-and-space)
- [Filters](#filters)
- [Envelopes](#envelopes)
- [Synth voice](#synth-voice)
- [Effects](#effects)
- [Values and arithmetic](#values-and-arithmetic)
- [Control, I/O and visuals](#control-io-and-visuals)
- [Gotchas](#gotchas)

---

## How code is shaped

```js
setcpm(120 / 4)                          // tempo: cycles per minute (here 120 BPM, 4 beats per cycle)

$: s("bd*4").bank("RolandTR909")         // each $: line is a track
$: note("c2 eb2 g2").s("sawtooth")
     .lpf(800)                           // chain operators to shape the sound
_$: s("hh*16")                           // _$: mutes a track
```

- A **cycle** is the basic unit of time. Everything in one pair of quotes is squeezed into one cycle.
- `"..."` (double quotes) is mini-notation and becomes a pattern. `'...'` (single quotes) is a plain string.
- **Ctrl/Cmd+Enter** runs the code, **Ctrl/Cmd+.** stops it.

| Function | What it does |
| --- | --- |
| `setcpm(n)` / `setcps(n)` | set tempo in cycles per minute / per second |
| `hush()` | stop everything |
| `$:` / `_$:` | start a track / mute it |

---

## Mini-notation (inside quotes)

| Syntax | Meaning | Example |
| --- | --- | --- |
| `a b c` | sequence, splits the cycle evenly | `"bd sd hh"` |
| `~` | rest | `"bd ~ sd ~"` |
| `[a b]` | group: fit several events into one step | `"bd [sd sd]"` |
| `<a b c>` | alternate: one per cycle | `"<bd sd cp>"` |
| `a*3` | repeat faster within the step | `"hh*8"` |
| `a/2` | stretch over 2 cycles | `"<c e g>/2"` |
| `a!3` | replicate as separate steps | `"bd!3 sd"` |
| `a@3` | weight: step is 3 times as long | `"bd@3 sd"` |
| `a, b` | play in parallel | `"bd*2, hh*4"` |
| `a?` / `a?0.3` | play with 50% / 70% chance (drop 30%) | `"hh*8?"` |
| `a\|b` | pick one at random each time | `"[bd\|sd]*8"` |
| `a(3,8)` | euclidean rhythm: 3 hits over 8 steps (optional rotation: `(3,8,2)`) | `"bd(3,8)"` |
| `a:2` | sample number 2 of a sound | `"bd:2 sd:1"` |
| `0 .. 7` | number range | `n("0 .. 7")` |
| `.` | separates groups, like `[...] [...]` | `"bd sd . hh hh hh"` |

---

## Sounds

| Function | What it does | Example |
| --- | --- | --- |
| `s(name)` / `sound` | play a sample or synth by name | `s("bd sd")`, `s("sawtooth")` |
| `.bank(name)` | pick a drum machine / sample bank | `s("bd*4").bank("RolandTR808")` |
| `n(numbers)` | sample index; scale degree when used with `.scale` | `s("hh*4").n("0 1 2 3")` |
| `samples(url)` | load a sample map (`strudel.json`, `github:user/repo`, …) | `samples('github:tidalcycles/dirt-samples')` |

**Built-in synth waveforms:** `sine`, `triangle`, `square`, `sawtooth`, `supersaw`. Noise: `white`, `pink`, `brown`.
**Common drum names:** `bd sd hh oh cp rim lt mt ht cr rd`.
**Banks:** `RolandTR909`, `RolandTR808`, `LinnDrum`, … (browse the sounds tab on strudel.cc).
**Melodic samples:** `piano`, `gm_epiano1`, `gm_acoustic_bass`, `gm_vibraphone`, `gm_pad_warm`, … (General MIDI soundfonts start with `gm_`).

---

## Pitch

| Function | What it does | Example |
| --- | --- | --- |
| `note(x)` | pitch by name or MIDI number (decimals for microtones) | `note("c3 eb3 g3")`, `note("60 60.5")` |
| `freq(hz)` | pitch in Hz | `freq("220 330")` |
| `.scale(name)` | turn `n` numbers into notes of a scale | `n("0 2 4").scale("C:minor")` |
| `chord(sym)` + `.voicing()` | chord symbols, voiced automatically | `chord("<Am7 D7 G^7>").voicing()` |
| `.arp(pattern)` | arpeggiate stacked notes by index | `note("[c3,e3,g3]").arp("0 1 2 1")` |
| `.transpose(semitones)` | shift by semitones | `.transpose("<0 5>")` |
| `.scaleTranspose(steps)` | shift by scale steps | `n("0 2").scale("C:major").scaleTranspose(1)` |

Scale names follow `"root:type"`, for example `"A:minor"`, `"D:dorian"`, `"C4:major pentatonic"`.

---

## Time

| Function | What it does | Example |
| --- | --- | --- |
| `.fast(n)` / `.slow(n)` | speed up / slow down | `.fast(2)`, `.slow("<1 2>")` |
| `.hurry(n)` | fast, and samples pitch up as well | `.hurry(2)` |
| `.early(t)` / `.late(t)` | shift in time (fraction of a cycle) | `.late(0.02)` |
| `.rev()` | reverse each cycle | `.rev()` |
| `.palindrome()` | play forwards, then backwards | `.palindrome()` |
| `.iter(n)` | start one step later each cycle | `.iter(4)` |
| `.ply(n)` | repeat each event n times | `.ply("<1 2>")` |
| `.linger(frac)` | loop the first part of the cycle | `.linger(0.25)` |
| `.swingBy(amount, n)` / `.swing(n)` | delay every other subdivision | `.swingBy(1/3, 4)` |
| `.ribbon(start, cycles)` | loop a chosen stretch of a long pattern | `.ribbon(4, 2)` |
| `.compress(b, e)` / `.zoom(b, e)` | squeeze into / zoom into part of a cycle | `.zoom(0, 0.5)` |
| `.inside(n, f)` / `.outside(n, f)` | apply `f` at a slower / faster time scale | `.inside(2, rev)` |

---

## Structure and rhythm

| Function | What it does | Example |
| --- | --- | --- |
| `.struct(pattern)` | impose a rhythm (`x` = hit) | `note("c2").struct("x ~ x x")` |
| `.mask(pattern)` | silence where the mask is `0` / `~` | `.mask("<1 [1 0]>")` |
| `.euclid(k, n)` / `.euclidRot(k, n, r)` | euclidean rhythm as a function | `s("bd").euclid(3, 8)` |
| `.segment(n)` | sample a continuous pattern n times per cycle | `sine.segment(16)` |
| `.every(n, f)` / `.firstOf(n, f)` | apply `f` once every n cycles (the first) | `.every(4, x => x.fast(2))` |
| `.lastOf(n, f)` | the same, on the last of every n cycles | `.lastOf(4, rev)` |
| `.chunk(n, f)` | apply `f` to one n-th of the cycle, moving each cycle | `.chunk(4, x => x.add(7))` |
| `.when(binary, f)` | apply `f` where the pattern is true | `.when("<0 1>", x => x.fast(2))` |
| `arrange([cycles, pat], …)` | song structure: play sections in order | `arrange([4, verse], [4, chorus])` |
| `pick` | choose between patterns by name or index | `"<0 1>".pick([drums, fill])` |

---

## Randomness and variation

| Function | What it does | Example |
| --- | --- | --- |
| `.sometimesBy(p, f)` | apply `f` to events with probability p | `.sometimesBy(0.3, x => x.speed(2))` |
| `.sometimes(f)` `.often(f)` `.rarely(f)` | 50% / 75% / 25% | `.rarely(x => x.crush(4))` |
| `.almostNever(f)` `.almostAlways(f)` | 10% / 90% | |
| `.someCyclesBy(p, f)` / `.someCycles(f)` | same idea, whole cycles at a time | `.someCycles(rev)` |
| `.degradeBy(p)` / `.degrade()` | randomly drop events (p = how many) | `.degradeBy(0.2)` |
| `rand`, `perlin` | random 0–1 per event / smooth random | `.gain(perlin.range(0.3, 0.8))` |
| `irand(n)` | random integers 0..n-1 (needs structure) | `n(irand(8).segment(8))` |
| `choose(…)` / `wchoose([v, w], …)` | random pick / weighted pick | `n(choose(0, 2, 4).segment(4))` |
| `chooseCycles(…)` | random pick, one per cycle | `chooseCycles(s("bd*4"), s("hh*8"))` |

---

## Layering

| Function | What it does | Example |
| --- | --- | --- |
| `stack(a, b, …)` | play patterns together | `stack(s("bd*4"), s("hh*8"))` |
| `cat(a, b, …)` | one pattern per cycle, in turn | `cat(s("bd*2"), s("sd*2"))` |
| `seq(a, b, …)` | all squeezed into one cycle | `seq("bd", "sd")` |
| `timeCat([w, a], [w, b])` | sequence with weights | `timeCat([3, s("bd*3")], [1, s("sd")])` |
| `.superimpose(f)` | add a transformed copy on top | `.superimpose(x => x.add(note(12)))` |
| `.layer(f, g, …)` | play several transformed versions (and not the original) | `.layer(x => x, x => x.add(note(7)))` |
| `.off(t, f)` | add a shifted, transformed copy | `.off(1/8, x => x.add(note(12)))` |
| `.jux(f)` / `.juxBy(w, f)` | original on the left, transformed on the right | `.jux(rev)` |
| `.echo(n, time, feedback)` | repeat events with fading copies | `.echo(3, 1/8, 0.5)` |

---

## Signals (continuous values)

`sine` `cosine` `saw` `isaw` `tri` `square` go from 0 to 1 over one cycle. `rand` and `perlin` are random. Use them as control values:

```js
.lpf(sine.range(300, 2000).slow(8))      // filter sweep over 8 cycles
.pan(sine.fast(2))                       // auto-pan
.gain(rand.range(0.4, 0.8))              // random velocity
```

| Method | What it does |
| --- | --- |
| `.range(min, max)` / `.rangex(min, max)` | scale to a range (linear / exponential) |
| `.slow(n)` / `.fast(n)` | change the speed of the sweep |
| `.segment(n)` | turn into n discrete steps per cycle |

---

## Sample manipulation

| Function | What it does | Example |
| --- | --- | --- |
| `.speed(x)` | playback rate (negative = reverse) | `.speed("1 2 -1")` |
| `.begin(x)` / `.end(x)` | play only part of a sample (0–1) | `.begin(0.25)` |
| `.loopAt(n)` | stretch the sample to n cycles | `s("brk").loopAt(2)` |
| `.fit()` | stretch the sample to the event length | `.fit()` |
| `.chop(n)` | cut each sample into n parts, in order | `.loopAt(2).chop(16)` |
| `.slice(n, pattern)` | cut into n slices and play them by index | `.slice(8, "0 1 <2 3> 4")` |
| `.splice(n, pattern)` | like slice, but each slice is stretched to fit its step | `.splice(8, "0 2 4 6")` |
| `.striate(n)` | interleave parts of the samples | `.striate(4)` |
| `.cut(group)` | a new sample stops the previous one in the same group | `.cut(1)` |
| `.clip(x)` / `.legato(x)` | note length relative to the event | `.clip(0.5)` |

---

## Volume and space

| Function | What it does | Example |
| --- | --- | --- |
| `.gain(x)` | volume (default 1) | `.gain("1 .5 .8 .5")` |
| `.velocity(x)` | multiplies gain, handy for accents | `.velocity(0.7)` |
| `.postgain(x)` | volume after the effects | `.postgain(1.5)` |
| `.pan(x)` | stereo position, 0 left – 1 right | `.pan(0.3)` |
| `.orbit(n)` | separate effect bus (its own reverb/delay) | `.orbit(2)` |

---

## Filters

| Function | What it does | Example |
| --- | --- | --- |
| `.lpf(hz)` / `.cutoff` | low-pass: darker | `.lpf(800)` |
| `.lpq(q)` / `.resonance` | low-pass resonance: squelch | `.lpq(12)` |
| `.hpf(hz)` / `.hpq(q)` | high-pass: thinner | `.hpf(300)` |
| `.bpf(hz)` / `.bpq(q)` | band-pass | `.bpf(1000)` |
| `.vowel(v)` | formant filter (`a e i o u`) | `.vowel("<a o>")` |

Filter envelope: `.lpenv(depth)` with `.lpattack` `.lpdecay` `.lpsustain` `.lprelease`. This is the classic 303 "pluck" (see `patterns/acid.js`).

---

## Envelopes

| Function | What it does | Example |
| --- | --- | --- |
| `.attack(s)` `.decay(s)` `.sustain(0–1)` `.release(s)` | amplitude envelope | `.attack(0.3).release(1)` |
| `.adsr("a:d:s:r")` | all four at once | `.adsr(".01:.1:.5:.2")` |
| `.penv(semitones)` + `.pattack` `.pdecay` | pitch envelope (kicks, zaps) | `.penv(12).pdecay(0.1)` |

---

## Synth voice

| Function | What it does | Example |
| --- | --- | --- |
| `.fm(index)` / `.fmi` | FM amount: brighter, metallic | `.fm(4)` |
| `.fmh(ratio)` | FM ratio (non-integer = bell-like) | `.fmh(2.756)` |
| `.fmdecay` `.fmsustain` `.fmenv` | envelope on the FM amount | `.fmdecay(0.2).fmsustain(0)` |
| `.vib(hz)` / `.vibmod(semitones)` | vibrato rate / depth | `.vib(5).vibmod(0.3)` |
| `.detune(x)` / `.unison(n)` | supersaw spread / number of voices | `s("supersaw").detune(0.5)` |

---

## Effects

| Function | What it does | Example |
| --- | --- | --- |
| `.room(x)` + `.size(x)` / `.roomsize` | reverb amount + size | `.room(0.6).size(4)` |
| `.delay(x)` `.delaytime(s)` `.delayfeedback(x)` | echo | `.delay(0.5).delaytime(0.375)` |
| `.shape(x)` / `.distort(x)` | saturation / distortion | `.shape(0.5)` |
| `.crush(bits)` / `.coarse(n)` | bit-crush / sample-rate reduction | `.crush(6)` |
| `.phaser(rate)` | phaser | `.phaser(2)` |

---

## Values and arithmetic

| Function | What it does | Example |
| --- | --- | --- |
| `.add(x)` `.sub` `.mul` `.div` | math on values (also on `note`/`n`/`freq` objects) | `.add(note(12))`, `"0 2".add("<0 3>")` |
| `run(n)` | `0 1 2 … n-1` | `n(run(8))` |
| `.fmap(fn)` | transform each value with a JS function | `"1 2 3".fmap(x => x * 110)` |
| `.filterValues(fn)` | keep only events whose value passes | `.filterValues(v => v.n < 2)` |

---

## Control, I/O and visuals

| Function | What it does | Example |
| --- | --- | --- |
| `slider(v, min, max, step)` | inline draggable fader in the editor | `.gain(slider(0.5, 0, 1))` |
| `.midi(device)` | send the pattern to a MIDI device | `note("c3 e3").midi()` |
| `midin(device)` | read knobs/faders from a MIDI controller | `const cc = await midin('IAC Driver Bus 1')` |
| `registerSound(name, fn)` | define your own sound with Web Audio | |
| `._pianoroll()` / `.pianoroll()` | piano roll inline / full background | `._pianoroll()` |
| `._punchcard()` `._scope()` `._spiral()` | other inline visuals | |
| `.color(c)` | colour for the visuals | `.color("cyan")` |
| `.log()` | print events to the console | |

---

## Gotchas

- **Major 7th chords are `C^7`**, not `Cmaj7`. Unknown chord symbols play nothing, with no error.
- **Effect values are read once per event.** `.lpf(sine…)` on one long note won't sweep. Add `.segment(16)` to retrigger the note (the wobble in `dubstep.js`).
- **Continuous patterns need structure.** `irand`, `rand` and `choose` have no rhythm of their own. Use `.segment(n)`, or use them inside a pattern that has one.
- **`pick` takes plain values:** `"<0 1>".pick([a, b])`, not `n("<0 1>").pick(...)`.
- **`n` vs `note`:** `n` is an index (sample number or scale degree), `note` is an actual pitch.
- **Audio starts on the first click or keypress.** Browsers block sound until you interact with the page.
