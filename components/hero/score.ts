import { WALK_STRIDES, walkAt } from "./walk";

/**
 * The hero's original score, synthesized live with the Web Audio API: nothing to download, no
 * licence to clear, and every cue can land exactly on a story beat. A bed of drone and pad chords
 * runs at 84 BPM in D minor; story moments (the vortex collapse, the launch, the landing, each ring
 * igniting, stepping into the light) fire stingers quantized to the next beat; scroll speed drives a
 * wind layer; footsteps follow the camera's footfalls during the walk; the last chord resolves to
 * D major as the light floods in.
 */

const BPM = 84;
const BEAT = 60 / BPM;
const LOOKAHEAD = .14;
// D minor: i – VI – iv – V (Dm, Bb, Gm, A), two bars each.
const CHORDS = [
  [146.83, 220, 293.66, 349.23],
  [116.54, 174.61, 233.08, 293.66],
  [98, 146.83, 196, 233.08],
  [110, 164.81, 220, 277.18],
];
const RESOLVE = [146.83, 220, 293.66, 369.99]; // D major: the light
const RING_BELLS = [587.33, 698.46, 880]; // D5, F5, A5

type State = { raw: number; progress: number; intro: number; finale: number };
type Cue = "collapse" | "launch" | "landing" | "ring0" | "ring1" | "ring2" | "flood";
// Forward crossings of these points fire cues (raw scroll unless noted).
const CUES: { id: Cue; at: (s: State) => number; threshold: number }[] = [
  { id: "collapse", at: (s) => s.intro, threshold: .92 },
  { id: "launch", at: (s) => s.progress, threshold: .3 },
  { id: "landing", at: (s) => s.raw, threshold: .67 },
  { id: "ring0", at: (s) => s.finale, threshold: .08 },
  { id: "ring1", at: (s) => s.finale, threshold: .21 },
  { id: "ring2", at: (s) => s.finale, threshold: .34 },
  { id: "flood", at: (s) => s.raw, threshold: .9 },
];

const smooth = (x: number, a: number, b: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export class Score {
  private ctx: AudioContext;
  private master: GainNode;
  private dry: GainNode;
  private wet: GainNode;
  private noise: AudioBuffer;
  private padFilter: BiquadFilterNode;
  private padGain: GainNode;
  private padVoices: OscillatorNode[] = [];
  private droneGain: GainNode;
  private wind: { gain: GainNode; filter: BiquadFilterNode };
  private nextBeat = 0;
  private beat = 0;
  private queue: Cue[] = [];
  private last: State = { raw: 0, progress: 0, intro: 0, finale: 0 };
  private lastTime = 0;
  private speed = 0;
  private lastStep = -1;
  private resolved = false;
  private level = 0;
  private timer = 0;
  private origin = 0;
  /** Cues as played, with their beat number: read by `?debug-audio` checks. */
  readonly log: { cue: Cue; beat: number; time: number }[] = [];

  constructor() {
    const ctx = this.ctx = new AudioContext({ latencyHint: "playback" });
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -16; compressor.ratio.value = 3; compressor.attack.value = .01; compressor.release.value = .3;
    this.master = ctx.createGain(); this.master.gain.value = 0;
    this.master.connect(compressor); compressor.connect(ctx.destination);
    this.dry = ctx.createGain(); this.dry.connect(this.master);
    // A generated hall: stereo noise with an exponential tail, so there is no impulse file to fetch.
    const reverb = ctx.createConvolver();
    reverb.buffer = this.impulse(3.4, 2.6);
    this.wet = ctx.createGain(); this.wet.gain.value = .55;
    this.wet.connect(reverb); reverb.connect(this.master);
    this.noise = this.whiteNoise(2);

    // Drone: D1 and D2.
    this.droneGain = ctx.createGain(); this.droneGain.gain.value = 0;
    this.droneGain.connect(this.dry); this.droneGain.connect(this.wet);
    for (const [frequency, type, level] of [[36.71, "sine", .9], [73.42, "triangle", .32]] as const) {
      const osc = ctx.createOscillator(); osc.type = type; osc.frequency.value = frequency;
      const g = ctx.createGain(); g.gain.value = level; osc.connect(g); g.connect(this.droneGain); osc.start();
    }
    // Pad: four voices, two detuned saws each, through a lowpass that opens as the story builds.
    this.padFilter = ctx.createBiquadFilter(); this.padFilter.type = "lowpass"; this.padFilter.frequency.value = 420; this.padFilter.Q.value = .7;
    this.padGain = ctx.createGain(); this.padGain.gain.value = 0;
    this.padFilter.connect(this.padGain); this.padGain.connect(this.dry); this.padGain.connect(this.wet);
    for (let v = 0; v < 4; v++) for (const detune of [-7, 7]) {
      const osc = ctx.createOscillator(); osc.type = "sawtooth"; osc.frequency.value = CHORDS[0][v]; osc.detune.value = detune;
      const g = ctx.createGain(); g.gain.value = .07; osc.connect(g); g.connect(this.padFilter); osc.start();
      this.padVoices.push(osc);
    }
    // Wind: band-passed noise whose level follows scroll speed — the sound of moving through the scene.
    const windSource = ctx.createBufferSource(); windSource.buffer = this.noise; windSource.loop = true;
    const windFilter = ctx.createBiquadFilter(); windFilter.type = "bandpass"; windFilter.frequency.value = 600; windFilter.Q.value = .8;
    const windGain = ctx.createGain(); windGain.gain.value = 0;
    windSource.connect(windFilter); windFilter.connect(windGain); windGain.connect(this.dry); windGain.connect(this.wet); windSource.start();
    this.wind = { gain: windGain, filter: windFilter };
  }

  get running() { return this.ctx.state === "running"; }

  async start() {
    await this.ctx.resume();
    if (!this.nextBeat) { this.nextBeat = this.ctx.currentTime + .05; this.origin = this.nextBeat; }
    if (!this.timer) this.timer = window.setInterval(() => this.schedule(), 25);
  }

  /** Fade the whole score in or out (pause, hidden tab, scrolled past the hero). */
  setLevel(level: number) {
    this.level = level;
    this.master.gain.setTargetAtTime(level * .8, this.ctx.currentTime, level ? .5 : .25);
  }

  /** Feed the story clocks every frame or so; crossings become quantized cues. */
  update(state: State) {
    const now = this.ctx.currentTime;
    const dt = Math.max(.016, now - this.lastTime || .05);
    const velocity = (state.raw - this.last.raw) / dt;
    this.speed += (Math.min(1, Math.abs(velocity) * 6) - this.speed) * .25;
    this.lastTime = now;
    for (const cue of CUES) {
      const before = cue.at(this.last), after = cue.at(state);
      if (before < cue.threshold && after >= cue.threshold && !this.queue.includes(cue.id)) this.queue.push(cue.id);
    }
    if (state.raw < .86) this.resolved = false;
    // Footsteps land on the camera's footfalls (two per stride cycle).
    const steps = Math.floor(walkAt(state.raw) * WALK_STRIDES * 2);
    if (this.lastStep >= 0 && steps !== this.lastStep && state.raw > .665 && state.raw < .99 && this.level > 0) this.footstep(now + .005, steps > this.lastStep ? 1 : .6);
    this.lastStep = steps;
    this.last = { ...state };

    // Continuous layers follow the story.
    const { raw, progress, finale } = state;
    const build = smooth(raw, 0, .2) * .5 + smooth(progress, .25, .6) * .3 + smooth(finale, 0, .6) * .2;
    this.droneGain.gain.setTargetAtTime(.22 + build * .18, now, .4);
    this.padGain.gain.setTargetAtTime(.28 + build * .5, now, .5);
    this.padFilter.frequency.setTargetAtTime(380 + build * 1500 + smooth(raw, .88, 1) * 1800, now, .4);
    this.wind.gain.gain.setTargetAtTime(this.speed * .16, now, .12);
    this.wind.filter.frequency.setTargetAtTime(380 + this.speed * 1600, now, .15);
  }

  close() { clearInterval(this.timer); this.timer = 0; void this.ctx.close(); }

  // ----- scheduling -----
  private schedule() {
    if (this.ctx.state !== "running") return;
    while (this.nextBeat < this.ctx.currentTime + LOOKAHEAD) { this.onBeat(this.beat, this.nextBeat); this.nextBeat += BEAT; this.beat++; }
  }

  private onBeat(beat: number, time: number) {
    const s = this.last;
    const bar = Math.floor(beat / 4), inBar = beat % 4;
    // Chords move every two bars; the final chord resolves to D major in the light.
    if (inBar === 0 && bar % 2 === 0 && !this.resolved) this.setChord(CHORDS[(bar / 2) % CHORDS.length], time);
    // Heartbeat pulse during the flight and the walk.
    const flight = s.progress > .28 && s.raw < .97;
    if (flight && (inBar === 0 || inBar === 2)) this.kick(time, inBar === 0 ? .55 : .35);
    // Arpeggio shimmer through the walk, eighth notes from the current chord.
    if (s.raw > .68 && s.raw < .99) {
      const chord = this.resolved ? RESOLVE : CHORDS[Math.floor(bar / 2) % CHORDS.length];
      for (const half of [0, .5]) this.bell(time + half * BEAT, chord[(beat * 2 + half * 2) % 4] * 4, .045, 1.1);
    }
    // Story cues land on this beat.
    // One cue per beat, so fast scrolling still plays the moments as a phrase rather than a pile-up.
    const cue = this.queue.shift();
    if (cue) { this.play(cue, time); this.log.push({ cue, beat: Math.round((time - this.origin) / BEAT * 1000) / 1000, time }); }
  }

  private play(cue: Cue, time: number) {
    if (cue === "collapse") { this.boom(time, 1); this.whoosh(time - BEAT * 2, BEAT * 2, true); }
    else if (cue === "launch") { this.whoosh(time, BEAT * 3); this.kick(time, .9); }
    else if (cue === "landing") { this.boom(time, .8); }
    else if (cue.startsWith("ring")) this.bell(time, RING_BELLS[Number(cue.slice(4))], .22, 4.5);
    else if (cue === "flood") {
      this.resolved = true;
      this.setChord(RESOLVE, time);
      this.boom(time, .55);
      RESOLVE.forEach((f, i) => this.bell(time + i * BEAT / 2, f * 4, .12, 5));
    }
  }

  private setChord(chord: number[], time: number) {
    this.padVoices.forEach((osc, i) => osc.frequency.setTargetAtTime(chord[Math.floor(i / 2)], time, .35));
  }

  // ----- instruments -----
  private envelope(time: number, peak: number, attack: number, decay: number) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(peak, time + attack);
    g.gain.exponentialRampToValueAtTime(.0001, time + attack + decay);
    return g;
  }

  private kick(time: number, level: number) {
    const osc = this.ctx.createOscillator(); osc.type = "sine";
    osc.frequency.setValueAtTime(110, time); osc.frequency.exponentialRampToValueAtTime(42, time + .22);
    const g = this.envelope(time, level * .7, .004, .5);
    osc.connect(g); g.connect(this.dry); osc.start(time); osc.stop(time + .6);
  }

  private boom(time: number, level: number) {
    const osc = this.ctx.createOscillator(); osc.type = "sine";
    osc.frequency.setValueAtTime(72, time); osc.frequency.exponentialRampToValueAtTime(26, time + 1.4);
    const g = this.envelope(time, level * .9, .006, 2.2);
    osc.connect(g); g.connect(this.dry); g.connect(this.wet); osc.start(time); osc.stop(time + 2.4);
    const noise = this.ctx.createBufferSource(); noise.buffer = this.noise;
    const lp = this.ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(900, time); lp.frequency.exponentialRampToValueAtTime(120, time + 1.2);
    const ng = this.envelope(time, level * .35, .004, 1.3);
    noise.connect(lp); lp.connect(ng); ng.connect(this.dry); ng.connect(this.wet); noise.start(time); noise.stop(time + 1.5);
  }

  private whoosh(time: number, duration: number, reverse = false) {
    const start = Math.max(this.ctx.currentTime, time);
    const noise = this.ctx.createBufferSource(); noise.buffer = this.noise; noise.loop = true;
    const bp = this.ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(reverse ? 300 : 2400, start); bp.frequency.exponentialRampToValueAtTime(reverse ? 3200 : 260, start + duration);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(.0001, start);
    g.gain.exponentialRampToValueAtTime(.28, start + duration * (reverse ? .95 : .25));
    g.gain.exponentialRampToValueAtTime(.0001, start + duration * (reverse ? 1 : 1.1));
    noise.connect(bp); bp.connect(g); g.connect(this.dry); g.connect(this.wet); noise.start(start); noise.stop(start + duration * 1.2);
  }

  private bell(time: number, frequency: number, level: number, decay: number) {
    // Struck-glass bell: a fundamental plus inharmonic partials, mostly into the hall.
    for (const [ratio, amount] of [[1, 1], [2.76, .35], [5.4, .12]] as const) {
      const osc = this.ctx.createOscillator(); osc.type = "sine"; osc.frequency.value = frequency * ratio;
      const g = this.envelope(time, level * amount, .005, decay / ratio);
      osc.connect(g); g.connect(this.dry); g.connect(this.wet); osc.start(time); osc.stop(time + decay + .1);
    }
  }

  private footstep(time: number, level: number) {
    // Stone underfoot: a short low thud with a gritty scuff.
    const osc = this.ctx.createOscillator(); osc.type = "sine";
    osc.frequency.setValueAtTime(95, time); osc.frequency.exponentialRampToValueAtTime(55, time + .09);
    const g = this.envelope(time, .22 * level, .003, .12);
    osc.connect(g); g.connect(this.dry); osc.start(time); osc.stop(time + .2);
    const noise = this.ctx.createBufferSource(); noise.buffer = this.noise;
    const bp = this.ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1400 + Math.random() * 500; bp.Q.value = .9;
    const ng = this.envelope(time, .07 * level, .002, .08);
    noise.connect(bp); bp.connect(ng); ng.connect(this.dry); ng.connect(this.wet); noise.start(time, Math.random()); noise.stop(time + .12);
  }

  // ----- buffers -----
  private whiteNoise(seconds: number) {
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * seconds, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  private impulse(seconds: number, decay: number) {
    const length = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = buffer.getChannelData(c);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
    return buffer;
  }
}
