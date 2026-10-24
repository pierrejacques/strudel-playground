# strudel playground

A local [Strudel](https://strudel.cc) live-coding setup: the Strudel REPL web component served by Vite, with your patterns kept as files.

## Run

```sh
npm install   # also generates the gamelan sample banks
npm run dev   # opens http://localhost:5173
```

Click into the editor, then:

| Key | Action |
| --- | --- |
| `Ctrl/Cmd/Option + Enter` | play / apply changes |
| `Ctrl/Cmd/Option + .` | stop |

The browser only allows audio after you interact with the page, so the first sound needs a click.

## Patterns

Every `patterns/*.js` file appears in the dropdown (`?p=<name>` in the URL picks one directly).

| File | Style | BPM | Technique it shows |
| --- | --- | --- | --- |
| `demo.js` | techno | 124 | acid bassline with filter sweep, muted arp to bring in |
| `acid.js` | acid house | 130 | TB-303 line: resonant filter + filter envelope (`.lpenv`), accents, distortion |
| `trance.js` | trance | 138 | rolling offbeat bass, gated supersaw (`.struct`), chord arpeggio (`.arp`) |
| `house.js` | deep house | 122 | swing (`.swingBy`), Rhodes stabs, fake sidechain pump with a gain envelope |
| `dnb.js` | drum & bass | 174 | two-step beat, chopped Amen break (`.loopAt` + `.chop`), detuned reese bass |
| `dubstep.js` | dubstep | 140 | half-time beat, wobble bass (`.segment` + filter LFO at changing speeds) |
| `ambient.js` | ambient | 60 | long attacks/releases, random sparse melody (`irand`, `.degradeBy`), noise wash |
| `lofi.js` | lo-fi hip hop | 84 | lazy swing, jazzy chords, `.crush` for sampler grit |
| `synthwave.js` | synthwave | 100 | octave-bouncing 8th bass, gated-reverb snare, LinnDrum kit |
| `gamelan-java-lancaran-synth.js` | Javanese lancaran, slendro · synth | 64 | tuning in Hz via `freq()`, FM bronze voices, colotomic gongs |
| `gamelan-java-lancaran.js` | Javanese lancaran, slendro · soundbank | 64 | same piece on samples; `.bank("slendro")` / `.bank("pelog")` |
| `gamelan-java-ladrang.js` | Javanese ladrang, pelog barang · soundbank | 46 | 32-beat form, 7-tone pelog, bonang octave pairs |
| `gamelan-java-srepegan.js` | Javanese srepegan, slendro · soundbank | 118 | fast wayang music, dense kenong, gong suwukan |
| `gamelan-bali-kebyar.js` | Balinese gong kebyar · soundbank | 112 | paired "ombak" tuning, kotekan telu, angsel breaks |
| `gamelan-bali-kebyar-synth.js` | Balinese gong kebyar · synth | 112 | same piece in Hz, with a live **ombak fader** (`slider`) |
| `gamelan-bali-gender-synth.js` | Balinese gender wayang, slendro · synth | 86 | two-hand quartet, nyog-cag kotekan, ombak fader |
| `gamelan-bali-angklung-synth.js` | Balinese gamelan angklung, 4-tone · synth | 126 | 4-tone scale, norot kotekan |
| `gamelan-bali-baleganjur.js` | Balinese baleganjur · soundbank | 132 | interlocking cymbal parts, marching gong cycle |
| `basics.js` | — | — | mini-notation and chord-symbol cheat sheet |

Gotchas found while writing these:

- Major-7th/9th chords are `C^7` / `C^9`. `Cmaj7` is silently ignored.
- Effects like `.lpf(sine...)` are sampled once per note. A long held note won't sweep, so add `.segment(16)` to retrigger it (that's how the wobble works).

You can edit in the browser editor or in your own editor. Saving a file in `patterns/` pushes the new code into the browser without reloading, so playback keeps running; press `Ctrl/Cmd + Enter` to hear it. Edits made in the browser are **not** written back to the file, so copy anything you want to keep.

The files are plain Strudel code, not ES modules. They have a `.js` extension only for syntax highlighting.

## Learn

- [HANDBOOK.md](HANDBOOK.md): the essential Strudel functions on one page
- Workshop: https://strudel.cc/workshop/getting-started
- Function reference: https://strudel.cc/learn
- Sounds browser: open https://strudel.cc and check the "sounds" tab

## Custom tunings and sounds

**Any frequency.** `freq(440)` sets a pitch in Hz directly, and `note(60.25)` takes fractional MIDI notes (cents). `gamelan-java-lancaran-synth.js` maps cipher numbers to Hz with a small `hz()` function, so a different tuning is just a different table.

**Sample banks.** `samples(...)` loads a *sample map*, a JSON object of `{ name: [file urls] }` (usually a `strudel.json`). Only the map is fetched up front. Each audio file is downloaded and decoded the first time it plays, then kept in memory until the page reloads. Nothing is saved to disk apart from the browser's normal HTTP cache. Sources it understands:

| Call | Loads from |
| --- | --- |
| `samples('/samples/bali/strudel.json')` | any URL, here our own bank in `public/` |
| `samples('github:user/repo')` | `strudel.json` at the root of a GitHub repo's `main` branch |
| `samples('local:')` | `http://localhost:5432`, served from a folder by `npx @strudel/sampler` |
| `samples('shabda:gong:4')` | Freesound search results via the shabda service |
| `samples({ kick: ['https://.../bd.wav'] }, 'https://base/')` | an inline map |

Prefixing keys with `name_` creates a bank: `bali_gangsa` is played with `s("gangsa").bank("bali")`. If the map gives a list, `n` picks the file. If it gives note names (`{ C4: ..., A4: ... }`), notes are pitch-shifted from the nearest sample.

**Our gamelan banks** are synthesized by `scripts/make-gamelan-banks.mjs`: `bali` (kebyar, pelog selisir) and a Javanese double set as two banks, `slendro` and `pelog`. Edit the tuning constants at the top and run `npm run make:gamelan` to regenerate them. To use real recordings instead, put WAVs in `public/samples/<bank>/` and write a `strudel.json` in the same shape. Freesound has gamelan packs; check each file's license.

**Faders.** `slider(value, min, max, step)` draws a draggable fader inline in the editor, e.g. `.gain(slider(0.5, 0, 1))`. Dragging changes the sound immediately, with no re-run. The gamelan synth demos use one for the ombak beat speed. For a hardware fader, `midin('device name')` reads MIDI CC values.

**Beyond samples.** `registerSound(name, fn)` defines a sound in code with the Web Audio API, and `.midi()` sends patterns to hardware or DAW instruments (as with any web MIDI, this needs a browser with Web MIDI, such as Chrome).
