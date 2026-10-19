import type { Event } from '../core/types';

export type Cue = 'hit' | 'armor' | 'component-destroyed' | 'poison' | 'revelation' | 'death';
export interface AudioPlayer { play(cues: readonly Cue[]): void; readonly muted: boolean; setMuted(muted: boolean): void }
/** Q06 replaces this silent stub with the pure event mapping. */
export function cuesFor(_events: readonly Event[]): Cue[] { return []; }
export function createAudio(): AudioPlayer {
  let muted = true;
  return { play(_cues) {}, get muted() { return muted; }, setMuted(value) { muted = value; } };
}
