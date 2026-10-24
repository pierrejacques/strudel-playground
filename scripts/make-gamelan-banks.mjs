// Generates gamelan soundbanks by additive synthesis and writes them as Strudel
// sample banks under public/samples/:
//
//   bali/      Balinese gong kebyar, pelog selisir        → s("gangsa").bank("bali")
//   java/      Javanese double set, slendro + pelog       → s("saron").bank("slendro") / .bank("pelog")
//
// Each folder gets a strudel.json sample map that Strudel loads with samples(...).
// Run: npm run make:gamelan
//
// The tuning is baked into the samples, so patterns pick keys by index and never
// touch Western note names. Edit the tuning constants and re-run to retune.
// Every real gamelan has its own tuning; these numbers are plausible example sets,
// not standards.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'samples');

// ── tunings ───────────────────────────────────────────────────

// Bali: 5-tone pelog selisir, ding dong deng dung dang (cents above ding)
const BALI = { ding: 318, cents: [0, 120, 265, 670, 785], ombak: 7 };

// Java: pitches are named by cipher numbers; slendro has no 4.
// saron1 is pitch 1 on the saron; other instruments sit whole octaves above/below.
const JAVA = {
  slendro: { saron1: 536, cents: { 1: 0, 2: 236, 3: 474, 5: 714, 6: 950 } },
  pelog: { saron1: 560, cents: { 1: 0, 2: 120, 3: 260, 4: 540, 5: 675, 6: 785, 7: 950 } },
};

// ── synthesis ─────────────────────────────────────────────────

// deterministic noise so re-running produces identical files
let seed = 1;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

// partials: [freqHz, amp, decaySeconds]
function render(rate, seconds, { partials = [], attack = 0.002, click = 0, clickDecay = 0.004, noise = 0, noiseDecay = 0.05, sweep }) {
  const len = Math.round(seconds * rate);
  const out = new Float32Array(len);
  for (const [f, amp, decay] of partials) {
    let phase = 0; // all partials start in phase for a solid strike
    for (let i = 0; i < len; i++) {
      const t = i / rate;
      const freq = sweep ? f * (1 + sweep.depth * Math.exp(-t / sweep.time)) : f;
      phase += (2 * Math.PI * freq) / rate;
      out[i] += amp * Math.sin(phase) * Math.exp(-t / decay);
    }
  }
  // mallet click / noise component, lightly high-passed
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const t = i / rate;
    const n = rand();
    const hp = n - prev;
    prev = n;
    out[i] += click * hp * Math.exp(-t / clickDecay) + noise * n * Math.exp(-t / noiseDecay);
  }
  // attack ramp, fade-out at the end, normalize to -1 dBFS
  const fade = Math.round(0.05 * rate);
  let peak = 0;
  for (let i = 0; i < len; i++) {
    const t = i / rate;
    if (t < attack) out[i] *= t / attack;
    if (i > len - fade) out[i] *= (len - i) / fade;
    peak = Math.max(peak, Math.abs(out[i]));
  }
  for (let i = 0; i < len; i++) out[i] *= 0.89 / peak;
  return { rate, samples: out };
}

function wav({ rate, samples }) {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + samples.length * 2, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(rate, 24);
  buf.writeUInt32LE(rate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), 44 + i * 2));
  return buf;
}

// metallophone bar: partial ratios of a free bar (1 : 2.76 : 5.40)
const bar = (rate, f, length, { upper = 0.28, click = 0.35 } = {}) =>
  render(rate, length, {
    partials: [
      [f, 1, length * 0.45],
      [f * 2.756, upper, 0.3],
      [f * 5.404, upper / 3, 0.1],
    ],
    click,
  });

// kettle gong (bonang, reyong, kenong): nearly harmonic partials, quicker upper decay
const kettle = (rate, f, length = 1.8, click = 0.2) =>
  render(rate, length, {
    partials: [
      [f, 1, length * 0.4],
      [f * 1.99, 0.3, length * 0.17],
      [f * 2.92, 0.15, length * 0.08],
      [f * 4.4, 0.08, length * 0.04],
    ],
    click,
  });

// small damped kettle (kethuk, kempyang, kempli)
const damped = (rate, f, decay = 0.09) =>
  render(rate, 0.5, {
    partials: [
      [f, 1, decay],
      [f * 1.52, 0.4, decay * 0.55],
      [f * 2.31, 0.2, decay * 0.33],
    ],
    click: 0.3,
  });

// hanging gong: two close fundamentals make the slow "wave" (ombak) of a real gong
const hangingGong = (rate, f, beat, length) =>
  render(rate, length, {
    partials: [
      [f, 0.6, length * 0.45],
      [f + beat, 0.6, length * 0.45],
      [f * 2.01, 0.3, length * 0.2],
      [f * 2.93, 0.18, length * 0.1],
      [f * 4.12, 0.1, length * 0.05],
    ],
    attack: 0.03,
    noise: 0.05,
    noiseDecay: 0.03,
    sweep: { depth: 0.02, time: 0.15 }, // gongs sag slightly in pitch after the strike
  });

// cymbals: many inharmonic high partials plus noise
const cymbal = (rate, decay, { low = 2500, spread = 4500, count = 24 } = {}) =>
  render(rate, decay * 3, {
    partials: Array.from({ length: count }, () => [low + (rand() + 1) * spread, 0.2 + (rand() + 1) * 0.2, decay]),
    noise: 0.6,
    noiseDecay: decay / 3,
  });

// two-headed drum strokes (kendang / kendhang)
const drum = (rate) => [
  render(rate, 0.6, { partials: [[72, 1, 0.22]], sweep: { depth: 0.5, time: 0.04 }, click: 0.2 }), // 0 low open
  render(rate, 0.4, { partials: [[165, 1, 0.14]], sweep: { depth: 0.25, time: 0.03 }, click: 0.25 }), // 1 high open
  render(rate, 0.25, { partials: [[420, 0.4, 0.03]], noise: 1, noiseDecay: 0.035 }), // 2 slap
  render(rate, 0.15, { partials: [[950, 0.6, 0.015]], click: 1, clickDecay: 0.006 }), // 3 rim / damped
];

// ── Bali bank ─────────────────────────────────────────────────

function baliBank() {
  const rate = 44100;
  const { ding, cents, ombak } = BALI;
  // degree 0..4 = ding..dang, 5..9 = the next octave up
  const pitch = (k, base = ding) => base * 2 ** (Math.floor(k / 5) + cents[k % 5] / 1200);
  const keys = (count, fn) => Array.from({ length: count }, (_, k) => fn(k));
  return {
    // pemade gangsa, pengumbang (lower) and pengisep (higher) of each pair
    gangsa: keys(10, (k) => bar(rate, pitch(k), 2.2)),
    gangsa_isep: keys(10, (k) => bar(rate, pitch(k) + ombak, 2.2)),
    // reyong: a row of kettle gongs, one octave above the gangsa
    reyong: keys(10, (k) => kettle(rate, pitch(k, ding * 2))),
    // jegogan: low bars two octaves down; the pair's beating is baked into one sample
    jegogan: keys(5, (k) => {
      const f = pitch(k, ding / 4);
      return render(rate, 4, {
        partials: [
          [f, 0.7, 1.8],
          [f + ombak / 2, 0.7, 1.8],
          [f * 2.756, 0.12, 0.4],
        ],
        attack: 0.008,
        click: 0.08,
      });
    }),
    gong: [hangingGong(rate, 41, 0.8, 8)], // gong ageng
    kempur: [hangingGong(rate, 83, 1.6, 5)],
    kempli: [damped(rate, 620)], // small damped gong that keeps the beat
    // bebende: gong without a boss, a flat buzzing crash used in baleganjur
    bebende: [
      render(rate, 3, {
        partials: [
          [180, 0.6, 1.2],
          [183, 0.6, 1.2],
          [397, 0.4, 0.6],
          [611, 0.3, 0.4],
          [873, 0.2, 0.25],
        ],
        noise: 0.25,
        noiseDecay: 0.3,
      }),
    ],
    // ceng-ceng (small cymbals on a stand): 0 = closed, 1 = open
    ceng: [cymbal(rate, 0.12), cymbal(rate, 0.6)],
    // ceng-ceng kopyak (big hand-held pairs used in baleganjur): 0 = damped "tek", 1 = open crash
    kopyak: [cymbal(rate, 0.08, { low: 1500, spread: 3000 }), cymbal(rate, 0.9, { low: 1200, spread: 3500 })],
    // kendang: 0 dag (low), 1 tut (high), 2 pek (slap), 3 ka (rim)
    kendang: drum(rate),
  };
}

// ── Java banks ────────────────────────────────────────────────

function javaBank({ saron1, cents }) {
  const rate = 24000; // plenty for these registers, keeps the double set small
  const order = Object.keys(cents).map(Number); // [1 2 3 5 6] or [1 .. 7]
  // one octave of keys starting at pitch 1 of the given base, optionally two rows
  const row = (base, octaves = 1) =>
    Array.from({ length: octaves }, (_, o) => order.map((p) => base * 2 ** (o + cents[p] / 1200))).flat();
  return {
    // the saron family: same instrument in three octaves
    demung: row(saron1 / 2).map((f) => bar(rate, f, 2.2)),
    saron: row(saron1).map((f) => bar(rate, f, 1.6)),
    peking: row(saron1 * 2).map((f) => bar(rate, f, 1.1)),
    // slenthem: thin bars over tube resonators, almost a pure tone with a long ring
    slenthem: row(saron1 / 4).map((f) => bar(rate, f, 3, { upper: 0.06, click: 0.05 })),
    // bonang barung: two rows of kettles, low row first
    bonang: row(saron1 / 2, 2).map((f) => kettle(rate, f, 1.4, 0.25)),
    // kenong and kempul: big kettles and small hanging gongs, one per pitch
    kenong: row(saron1 / 2).map((f) => kettle(rate, f, 2.8, 0.1)),
    kempul: row(saron1 / 4).map((f) => hangingGong(rate, f, 1.2, 3.5)),
    // kethuk is tuned to 2 (slendro) or 6 (pelog); kempyang sits high
    kethuk: [damped(rate, (saron1 / 4) * 2 ** (cents[order.includes(4) ? 6 : 2] / 1200), 0.08)],
    kempyang: [damped(rate, saron1 * 2, 0.06)],
    // kendhang: 0 dhah (deep), 1 dhung (open), 2 tak (slap), 3 ket (damped)
    kendhang: drum(rate),
  };
}

// ── write files + sample maps ─────────────────────────────────

function writeBank(folder, banks, shared = {}) {
  const dir = join(ROOT, folder);
  rmSync(dir, { recursive: true, force: true });
  // "_base" must end in "/": Strudel joins it to each path with plain string concatenation.
  const map = { _base: `/samples/${folder}/` };
  const save = (path, sound) => {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), wav(sound));
    return path;
  };
  // shared sounds are written once and listed under every bank
  const sharedPaths = Object.fromEntries(
    Object.entries(shared).map(([name, takes]) => [name, takes.map((s, i) => save(`common/${name}/${String(i).padStart(2, '0')}.wav`, s))]),
  );
  for (const [bank, instruments] of Object.entries(banks)) {
    // a "<bank>_" prefix makes it a bank: s("saron").bank("pelog") plays "pelog_saron"
    for (const [name, takes] of Object.entries(instruments)) {
      map[`${bank}_${name}`] = takes.map((s, i) => save(`${bank}/${name}/${String(i).padStart(2, '0')}.wav`, s));
    }
    for (const [name, paths] of Object.entries(sharedPaths)) map[`${bank}_${name}`] = paths;
  }
  writeFileSync(join(dir, 'strudel.json'), JSON.stringify(map, null, 2) + '\n');
  const count = Object.entries(map).filter(([k]) => k !== '_base').reduce((n, [, v]) => n + v.length, 0);
  console.log(`${folder}: ${Object.keys(map).length - 1} sounds, ${count} sample slots`);
}

writeBank('bali', { bali: baliBank() });
writeBank(
  'java',
  { slendro: javaBank(JAVA.slendro), pelog: javaBank(JAVA.pelog) },
  {
    gong: [hangingGong(24000, 40, 0.6, 9)], // gong ageng
    suwukan: [hangingGong(24000, 68, 1, 6)], // gong suwukan, the smaller gong used in fast pieces
  },
);
