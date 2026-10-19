import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAudio, cuesFor } from '../src/audio';
import type { Cue } from '../src/audio';
import type { DamageBreakdown, Event as CombatEvent, EventKind, StatusKind } from '../src/core/types';

const enemy = 'celestial-guard#0' as const;
const target = { enemy, part: 'weapon-arm' } as const;
const intent = 'r1.celestial-guard#0.strike' as const;
const source = { kind: 'action', actor: 'ugallu', action: 'claw' } as const;
const revelationSource = { kind: 'action', action: 'rend' } as const;
const damage: DamageBreakdown = {
  damageType: 'physical', raw: 13, armor: 0, ward: 0, weakened: 0,
  rupture: 0, guard: 0, hold: 0, applied: 9,
};
// Typed, test-owned events: no rule functions or shipped content defaults.
const cases: Record<EventKind, { event: CombatEvent; cues: Cue[] }> = {
  'round-started': { event: { kind: 'round-started', round: 1 }, cues: [] },
  'intent-declared': { event: { kind: 'intent-declared', intent: {
    id: intent, enemy, sourcePart: 'weapon-arm', kind: 'strike', target: { brood: 'ugallu' },
    damageType: 'physical', amount: 13, modifiers: [], riders: [], ward: 0,
    status: 'pending', cancellationReason: null,
  } }, cues: [] },
  'action-used': { event: { kind: 'action-used', actor: 'ugallu', action: 'claw', target }, cues: [] },
  'part-damaged': { event: { kind: 'part-damaged', target, source, damage, remaining: 11 }, cues: ['hit'] },
  'part-destroyed': { event: { kind: 'part-destroyed', target }, cues: ['component-destroyed'] },
  'enemy-died': { event: { kind: 'enemy-died', enemy }, cues: ['death'] },
  'intent-cancelled': { event: { kind: 'intent-cancelled', intent, reason: 'source-destroyed' }, cues: [] },
  'intent-skipped': { event: { kind: 'intent-skipped', intent, reason: 'target-dead' }, cues: [] },
  'intent-redirected': { event: { kind: 'intent-redirected', intent, from: 'anzu', to: 'ugallu' }, cues: [] },
  'intent-resolved': { event: { kind: 'intent-resolved', intent }, cues: [] },
  'brood-damaged': { event: { kind: 'brood-damaged', brood: 'ugallu', source: { kind: 'intent', intent }, damage, remaining: 11 }, cues: ['hit'] },
  'brood-healed': { event: { kind: 'brood-healed', brood: 'ugallu', actor: 'anzu', amount: 9, remaining: 11 }, cues: [] },
  'brood-died': { event: { kind: 'brood-died', brood: 'ugallu' }, cues: ['death'] },
  'status-applied': { event: { kind: 'status-applied', target: { enemy }, status: 'poison', amount: 9, untilRound: null, source: null }, cues: ['poison'] },
  'status-removed': { event: { kind: 'status-removed', target: { enemy }, status: 'poison', reason: 'consumed' }, cues: [] },
  'poison-ticked': { event: { kind: 'poison-ticked', enemy, amount: 9, remainingPoison: 2 }, cues: ['poison'] },
  'revelation-gained': { event: { kind: 'revelation-gained', brood: 'ugallu', amount: 9, revelation: 11, source: revelationSource }, cues: ['revelation'] },
  'revelation-burned': { event: { kind: 'revelation-burned', brood: 'ugallu', amount: 9, applied: 9, remainingHp: 11, source: revelationSource }, cues: ['hit'] },
  'transformation-started': { event: { kind: 'transformation-started', brood: 'ugallu', transformation: { id: 'ugallu-rapture', kind: 'rapture', untilRound: 2 } }, cues: ['revelation'] },
  'transformation-ended': { event: { kind: 'transformation-ended', brood: 'ugallu', form: 'ugallu-rapture', reason: 'expired', revelation: 2 }, cues: [] },
  'retaliated': { event: { kind: 'retaliated', actor: 'ugallu', intent, target, damage }, cues: ['hit'] },
  'item-used': { event: { kind: 'item-used', actor: 'ugallu', item: 'salve', target: 'anzu', usesRemaining: 1 }, cues: [] },
  'combat-ended': { event: { kind: 'combat-ended', outcome: 'victory', fightIndex: 0 }, cues: [] },
  'fight-continued': { event: { kind: 'fight-continued', encounterId: 'guard', fightIndex: 1 }, cues: [] },
};

function freeze(value: unknown): void {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
}

describe('event-to-cue contract (Q06 acceptance 1)', () => {
  for (const [kind, { event, cues }] of Object.entries(cases)) {
    it(`maps ${kind} from its event data`, () => {
      expect(cuesFor([event]).sort()).toEqual([...cues].sort());
    });
  }
  for (const kind of ['part-damaged', 'brood-damaged', 'retaliated'] as const) {
    it(`${kind}: only positive applied damage produces a hit; raw damage is insufficient`, () => {
      const event = cases[kind].event as Extract<CombatEvent, { kind: typeof kind }>;
      for (const applied of [0, 1, 7]) {
        expect(cuesFor([{ ...event, damage: { ...damage, applied } }])).toEqual(applied > 0 ? ['hit'] : []);
      }
    });
    it(`${kind}: armor and Ward produce armor cues even when damage is fully blocked`, () => {
      const event = cases[kind].event as Extract<CombatEvent, { kind: typeof kind }>;
      for (const [armor, ward] of [[0, 0], [1, 0], [0, 1], [5, 3]]) {
        const cues = cuesFor([{ ...event, damage: { ...damage, applied: 0, armor: armor!, ward: ward! } }]);
        expect(cues.includes('armor')).toBe(armor! >= 1 || ward! >= 1);
        expect(cues).not.toContain('hit');
      }
      expect(cuesFor([{ ...event, damage: { ...damage, armor: 1, ward: 1 } }]).sort()).toEqual(['armor', 'hit']);
    });
    it(`${kind}: Guard, Hold and Weakened do not imply armor`, () => {
      const event = cases[kind].event as Extract<CombatEvent, { kind: typeof kind }>;
      expect(cuesFor([{ ...event, damage: { ...damage, applied: 0, guard: 5, hold: 3, weakened: 7 } }])).toEqual([]);
    });
  }
  it('burn damage cues depend on actual HP removed', () => {
    expect(cuesFor([{ kind: 'revelation-burned', brood: 'ugallu', amount: 9, applied: 0, remainingHp: 11, source: revelationSource }])).toEqual([]);
  });
  it('other applied statuses are silent, including Ward declaration', () => {
    const statuses: StatusKind[] = ['weakened', 'ward', 'guard', 'hold', 'pinned', 'clamped'];
    for (const status of statuses) {
      expect(cuesFor([{ kind: 'status-applied', target: { enemy }, status, amount: 9, untilRound: 1, source: null }])).toEqual([]);
    }
  });
  it('is pure and deterministic with frozen input, independent output arrays and no browser', () => {
    vi.stubGlobal('document', undefined);
    vi.stubGlobal('AudioContext', undefined);
    const events = Object.values(cases).map(c => structuredClone(c.event));
    const original = structuredClone(events);
    freeze(events);
    const first = cuesFor(events);
    const second = cuesFor(events);
    expect(first).toEqual(second);
    expect(first).not.toBe(second);
    first.length = 0;
    expect(cuesFor(events)).toEqual(second);
    expect(events).toEqual(original);
    expect(cuesFor([])).toEqual([]);
  });
});

// A minimal Web Audio boundary records the rendered graph and parameter curves.
// Assertions below protect audible output, distinctness, mute and device lifecycle;
// they do not pin exact synthesis pitches, node counts or method call ordering.
class Parameter {
  value = 1;
  curve: { value: number; time: number }[] = [];
  setValueAtTime(value: number, time: number) { this.curve.push({ value, time }); }
  linearRampToValueAtTime(value: number, time: number) { this.curve.push({ value, time }); }
  exponentialRampToValueAtTime(value: number, time: number) { this.curve.push({ value, time }); }
}
class Node {
  connections: Node[] = [];
  connect(node: Node) { this.connections.push(node); return node; }
  disconnect() { this.connections = []; }
}
class Gain extends Node { gain = new Parameter(); }
class Oscillator extends Node {
  type = 'sine';
  frequency = new Parameter();
  startTime = NaN;
  stopTime = NaN;
  onended?: () => void;
  start(time: number) { this.startTime = time; }
  stop(time: number) { this.stopTime = time; }
}
class Context {
  static instances: Context[] = [];
  static initialState = 'running';
  static rejectResume = false;
  state = Context.initialState;
  destination = new Node();
  currentTime = 20;
  oscillators: Oscillator[] = [];
  constructor() { Context.instances.push(this); }
  createGain() { return new Gain(); }
  createOscillator() { const oscillator = new Oscillator(); this.oscillators.push(oscillator); return oscillator; }
  resume() {
    if (Context.rejectResume) return Promise.reject(new Error('blocked'));
    this.state = 'running';
    return Promise.resolve();
  }
}
function browser() {
  Context.instances = [];
  Context.initialState = 'running';
  Context.rejectResume = false;
  const gestures = new EventTarget();
  vi.stubGlobal('document', gestures);
  vi.stubGlobal('navigator', { userActivation: { isActive: false } });
  vi.stubGlobal('AudioContext', Context);
  return gestures;
}
function hasOutput(node: Node, destination: Node): boolean {
  if (node instanceof Gain && node.gain.value === 0) return false;
  return node === destination || node.connections.some(next => hasOutput(next, destination));
}
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('synthesized player contract (Q06 acceptance 2)', () => {
  it('waits for a user gesture, then synthesizes every cue with a distinct audible signature', () => {
    const gestures = browser();
    const player = createAudio();
    player.setMuted(false);
    const all: Cue[] = ['hit', 'armor', 'component-destroyed', 'poison', 'revelation', 'death'];
    player.play(all);
    expect(Context.instances).toHaveLength(0);
    gestures.dispatchEvent(new Event('pointerdown'));
    const context = Context.instances[0]!;
    const signatures: string[] = [];
    for (const cue of all) {
      const before = context.oscillators.length;
      player.play([cue]);
      const rendered = context.oscillators.slice(before);
      expect(rendered.length).toBeGreaterThan(0);
      const cueSignature = [];
      for (const oscillator of rendered) {
        expect(hasOutput(oscillator, context.destination)).toBe(true);
        expect(oscillator.startTime).toBeGreaterThanOrEqual(context.currentTime);
        expect(oscillator.stopTime).toBeGreaterThan(oscillator.startTime);
        const envelope = oscillator.connections[0] as Gain;
        expect(envelope.gain.curve.some(point => point.value > 0)).toBe(true);
        expect(envelope.gain.curve.at(-1)?.value).toBe(0);
        expect(oscillator.frequency.curve.every(point => point.value > 0 && Number.isFinite(point.time))).toBe(true);
        cueSignature.push({
          wave: oscillator.type,
          pitch: oscillator.frequency.curve.map(p => p.value),
          envelope: envelope.gain.curve.map(p => ({ value: p.value, time: p.time - oscillator.startTime })),
        });
      }
      signatures.push(JSON.stringify(cueSignature));
    }
    expect(new Set(signatures).size).toBe(all.length);
  });
  it('retains mute across play calls and gestures and silences already scheduled sounds', () => {
    const gestures = browser();
    const player = createAudio();
    player.setMuted(false);
    gestures.dispatchEvent(new Event('keydown'));
    player.play(['death']);
    const context = Context.instances[0]!;
    expect(context.oscillators.some(o => hasOutput(o, context.destination))).toBe(true);
    player.setMuted(true);
    for (let i = 0; i < 2; i++) {
      gestures.dispatchEvent(new Event('pointerdown'));
      player.play(['hit']);
      expect(player.muted).toBe(true);
      expect(context.oscillators.every(o => !hasOutput(o, context.destination))).toBe(true);
    }
    player.setMuted(false);
    player.play(['revelation']);
    expect(player.muted).toBe(false);
    expect(context.oscillators.some(o => hasOutput(o, context.destination))).toBe(true);
    expect(Context.instances).toHaveLength(1);
  });
  it('can unlock when called directly inside a gesture before the document handler', () => {
    browser();
    vi.stubGlobal('navigator', { userActivation: { isActive: true } });
    const player = createAudio();
    player.setMuted(false);
    player.play(['hit']);
    const context = Context.instances[0]!;
    expect(context.oscillators.some(o => hasOutput(o, context.destination))).toBe(true);
  });
  it('resumes a suspended device on a keyboard gesture', async () => {
    const gestures = browser();
    Context.initialState = 'suspended';
    const player = createAudio();
    player.setMuted(false);
    gestures.dispatchEvent(new Event('keydown'));
    await Promise.resolve();
    player.play(['hit']);
    const context = Context.instances[0]!;
    expect(context.oscillators.some(o => hasOutput(o, context.destination))).toBe(true);
  });
  it('plays the first gesture cues after asynchronous resume, honoring mute while waiting', async () => {
    browser();
    Context.initialState = 'suspended';
    vi.stubGlobal('navigator', { userActivation: { isActive: true } });
    let resume!: () => void;
    vi.spyOn(Context.prototype, 'resume').mockImplementation(function (this: Context) {
      return new Promise<void>(resolve => {
        resume = () => { this.state = 'running'; resolve(); };
      });
    });
    const player = createAudio();
    player.setMuted(false);
    player.play(['hit']);
    const context = Context.instances[0]!;
    expect(context.oscillators).toHaveLength(0);
    resume();
    await Promise.resolve();
    await Promise.resolve();
    expect(context.oscillators.some(o => hasOutput(o, context.destination))).toBe(true);
    context.state = 'suspended';
    player.play(['poison']);
    player.setMuted(true);
    resume();
    await Promise.resolve();
    await Promise.resolve();
    expect(context.oscillators.every(o => !hasOutput(o, context.destination))).toBe(true);
  });
  it('is safe with no browser or Web Audio implementation', () => {
    vi.stubGlobal('document', undefined);
    vi.stubGlobal('navigator', undefined);
    vi.stubGlobal('AudioContext', undefined);
    expect(() => {
      const player = createAudio();
      player.setMuted(false);
      player.play(['hit']);
      player.setMuted(true);
      expect(player.muted).toBe(true);
    }).not.toThrow();
  });
  it('is safe when a browser has no AudioContext', () => {
    const gestures = browser();
    vi.stubGlobal('AudioContext', undefined);
    expect(() => {
      const player = createAudio();
      player.setMuted(false);
      gestures.dispatchEvent(new Event('pointerdown'));
      player.play(['poison']);
    }).not.toThrow();
  });
  it('absorbs device construction failures and resume rejection', async () => {
    const gestures = browser();
    vi.stubGlobal('AudioContext', class { constructor() { throw new Error('no device'); } });
    const unavailable = createAudio();
    unavailable.setMuted(false);
    expect(() => gestures.dispatchEvent(new Event('keydown'))).not.toThrow();
    expect(() => unavailable.play(['hit'])).not.toThrow();
    vi.stubGlobal('AudioContext', Context);
    Context.initialState = 'suspended';
    Context.rejectResume = true;
    const blocked = createAudio();
    blocked.setMuted(false);
    expect(() => gestures.dispatchEvent(new Event('pointerdown'))).not.toThrow();
    expect(() => blocked.play(['hit'])).not.toThrow();
    await Promise.resolve();
    await Promise.resolve();
    expect(Context.instances.every(context => context.oscillators.length === 0)).toBe(true);
  });
});
