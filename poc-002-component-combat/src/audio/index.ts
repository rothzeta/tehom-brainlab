/** Synthesized presentation cues (brief §4, §5, §7; ADR-0007).
 * No files, randomness or rule calls. Each event contributes its cues; repeated
 * events remain audible rather than being deduplicated across a command.
 *
 * Cue                Waveform   Pitch (Hz)       Envelope (seconds)
 * hit                triangle   180 → 65         quick attack, 0.10 decay
 * armor              square     900 → 600        quick attack, 0.07 decay
 * component-destroyed sawtooth   240 → 35         quick attack, 0.28 decay
 * poison             sine       420 → 160        soft attack, 0.22 decay
 * revelation         sine       330 → 880        soft attack, 0.36 decay
 * death              triangle   150 → 25         soft attack, 0.55 decay
 *
 * Starts muted, as in the Q01 interface. Mute is retained by this player for its
 * session and silences already scheduled sounds through the output gain.
 * Context creation/resume is attempted only at a gesture; unavailable or blocked
 * audio is silent. Call play with committed events, never preview events.
 */
import type { Event } from '../core/types';

export type Cue = 'hit' | 'armor' | 'component-destroyed' | 'poison' | 'revelation' | 'death';
export interface AudioPlayer { play(cues: readonly Cue[]): void; readonly muted: boolean; setMuted(muted: boolean): void }

export function cuesFor(events: readonly Event[]): Cue[] {
  const cues: Cue[] = [];
  for (const event of events) {
    switch (event.kind) {
      case 'part-damaged':
      case 'brood-damaged':
      case 'retaliated':
        if (event.damage.applied > 0) cues.push('hit');
        if (event.damage.armor >= 1 || event.damage.ward >= 1) cues.push('armor');
        break;
      case 'revelation-burned':
        if (event.applied > 0) cues.push('hit');
        break;
      case 'part-destroyed': cues.push('component-destroyed'); break;
      case 'status-applied':
        if (event.status === 'poison') cues.push('poison');
        break;
      case 'poison-ticked': cues.push('poison'); break;
      case 'revelation-gained':
      case 'transformation-started': cues.push('revelation'); break;
      case 'brood-died':
      case 'enemy-died': cues.push('death'); break;
    }
  }
  return cues;
}

interface Tone { wave: OscillatorType; from: number; to: number; attack: number; duration: number }
const tones: Record<Cue, Tone> = {
  hit: { wave: 'triangle', from: 180, to: 65, attack: 0.003, duration: 0.10 },
  armor: { wave: 'square', from: 900, to: 600, attack: 0.002, duration: 0.07 },
  'component-destroyed': { wave: 'sawtooth', from: 240, to: 35, attack: 0.004, duration: 0.28 },
  poison: { wave: 'sine', from: 420, to: 160, attack: 0.025, duration: 0.22 },
  revelation: { wave: 'sine', from: 330, to: 880, attack: 0.035, duration: 0.36 },
  death: { wave: 'triangle', from: 150, to: 25, attack: 0.025, duration: 0.55 },
};

export function createAudio(): AudioPlayer {
  let muted = true;
  let context: AudioContext | undefined;
  let output: GainNode | undefined;
  let ready: Promise<void> | undefined;

  // Registration is lazy too: importing this module is safe outside a browser.
  const gestures = typeof document === 'undefined' ? undefined : document;
  function unlock() {
    try {
      if (!context) {
        if (typeof globalThis.AudioContext !== 'function') return;
        context = new AudioContext();
        output = context.createGain();
        output.gain.value = muted ? 0 : 0.12;
        output.connect(context.destination);
      }
      if (context.state === 'suspended') ready = context.resume().catch(() => {});
    } catch {
      // Presentation failure must never interrupt a committed action.
    }
  }
  // Keep resume listeners: browsers may suspend audio again after tab switching.
  gestures?.addEventListener('pointerdown', unlock, { passive: true });
  gestures?.addEventListener('keydown', unlock);

  function sound(cues: readonly Cue[]) {
    if (muted || !context || !output || context.state !== 'running') return;
    // A short sequence preserves cue identity when one action emits many events.
    cues.forEach((cue, index) => {
      const tone = tones[cue];
      if (!tone || !context || !output) return;
      const start = context.currentTime + index * 0.06;
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = tone.wave;
      oscillator.frequency.setValueAtTime(tone.from, start);
      oscillator.frequency.exponentialRampToValueAtTime(tone.to, start + tone.duration);
      envelope.gain.setValueAtTime(0, start);
      envelope.gain.linearRampToValueAtTime(1, start + tone.attack);
      envelope.gain.linearRampToValueAtTime(0, start + tone.duration);
      oscillator.connect(envelope);
      envelope.connect(output);
      oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
      oscillator.start(start);
      oscillator.stop(start + tone.duration);
    });
  }

  return {
    play(cues) {
      if (muted || cues.length === 0) return;
      try {
        // Also covers callers that play in a gesture before the document listener.
        if (typeof navigator !== 'undefined' && navigator.userActivation?.isActive) unlock();
        if (context?.state === 'suspended') {
          // The first gesture may still be unlocking the audio device.
          const pending = [...cues];
          void ready?.then(() => {
            try { sound(pending); } catch { /* Audio is optional. */ }
          });
          return;
        }
        sound(cues);
      } catch { /* No browser/audio failure may escape into the game. */ }
    },
    get muted() { return muted; },
    setMuted(value) {
      muted = value;
      if (output) output.gain.value = muted ? 0 : 0.12;
    },
  };
}
