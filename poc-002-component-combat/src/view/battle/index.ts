import type Phaser from 'phaser';
import type { BattleSession, FightOptions } from '../../core/types';
import type { AudioPlayer } from '../../audio';

export interface BattleMountOptions extends FightOptions {
  game: Phaser.Game;
  audio: AudioPlayer;
  onExit: () => void;
}
/** A null session permits the scaffold/loading screen before Q02/Q05 mount a
 * live session. Q05 owns the implementation and src/view/session.ts. */
export function mountBattle(root: HTMLElement, _session: BattleSession | null, options: BattleMountOptions): () => void {
  const message = document.createElement('p');
  message.dataset.screen = 'battle';
  message.dataset.encounter = options.encounterId;
  message.dataset.party = options.party.join(',');
  message.dataset.start = options.start;
  message.textContent = `Battle — ${options.encounterId} (${options.party.join(', ')}; ${options.start}) — Q05`;
  root.append(message);
  return () => message.remove();
}
