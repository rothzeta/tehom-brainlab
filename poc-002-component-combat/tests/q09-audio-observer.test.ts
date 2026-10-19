import { afterEach, expect, it, vi } from 'vitest';
import { createAudio } from '../src/audio';
import type { Cue } from '../src/audio';

afterEach(() => { vi.unstubAllGlobals(); });

it('gives the observer an independent copy for each request', () => {
  const seen: Cue[][] = [];
  vi.stubGlobal('__POC002_AUDIO_TEST_OBSERVER__', (cues: Cue[]) => { seen.push(cues); });
  const player = createAudio();
  const input: Cue[] = ['hit', 'armor'];
  player.play(input);
  player.play(input);
  expect(seen).toEqual([['hit', 'armor'], ['hit', 'armor']]);
  expect(seen[0]).not.toBe(input);
  expect(seen[0]).not.toBe(seen[1]);
  seen[0]!.splice(0, 2, 'death');
  expect(input).toEqual(['hit', 'armor']);
  expect(seen[1]).toEqual(['hit', 'armor']);
  input.push('poison');
  expect(seen[1]).toEqual(['hit', 'armor']);
});

it('observes nonempty requests while muted without changing the mute choice', () => {
  const seen: Cue[][] = [];
  vi.stubGlobal('__POC002_AUDIO_TEST_OBSERVER__', (cues: Cue[]) => { seen.push(cues); });
  const player = createAudio();
  expect(player.muted).toBe(true);
  player.play([]);
  player.play(['poison']);
  player.play(['revelation', 'death']);
  expect(seen).toEqual([['poison'], ['revelation', 'death']]);
  expect(player.muted).toBe(true);
});

// Observe the Web Audio boundary without pinning any pitch, waveform or envelope.
// A throwing/mutating observer must leave the same audible output as no observer.
it('isolates observer mutations and exceptions from unmuted playback', () => {
  const signals: unknown[][] = [];
  const parameter = (signal: unknown[]) => ({
    value: 1,
    setValueAtTime: (value: number, time: number) => signal.push(['set', value, time]),
    exponentialRampToValueAtTime: (value: number, time: number) => signal.push(['exponential', value, time]),
    linearRampToValueAtTime: (value: number, time: number) => signal.push(['linear', value, time]),
  });
  vi.stubGlobal('document', undefined);
  vi.stubGlobal('navigator', { userActivation: { isActive: true } });
  vi.stubGlobal('AudioContext', class {
    state = 'running'; currentTime = 0; destination = {};
    createGain() { return { gain: parameter([]), connect() {}, disconnect() {} }; }
    createOscillator() {
      const signal: unknown[] = []; signals.push(signal);
      return { type: 'sine', frequency: parameter(signal), connect() {}, disconnect() {},
        start: (time: number) => signal.push(['start', time]),
        stop: (time: number) => signal.push(['stop', time]), onended: null };
    }
  });
  vi.stubGlobal('__POC002_AUDIO_TEST_OBSERVER__', undefined);
  const baseline = createAudio(); baseline.setMuted(false); baseline.play(['hit']);
  const withoutObserver = structuredClone(signals);
  expect(withoutObserver.length).toBeGreaterThan(0);
  signals.length = 0;
  let notified = false;
  vi.stubGlobal('__POC002_AUDIO_TEST_OBSERVER__', (cues: Cue[]) => {
    notified = true;
    cues.length = 0;
    throw new Error('broken test observer');
  });
  const observed = createAudio(); observed.setMuted(false);
  expect(() => observed.play(Object.freeze(['hit'] as Cue[]))).not.toThrow();
  expect(notified).toBe(true);
  expect(signals).toEqual(withoutObserver);
  expect(observed.muted).toBe(false);
});
