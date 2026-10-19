import type Phaser from 'phaser';
import type { AudioPlayer } from '../../audio';
import type { Content } from '../../core/types';
import { mountBattle } from '../battle';
import type { StartRequest } from '../select';
import { createRunSession } from './session';

export interface RunMountOptions {
  content: Content;
  game: Phaser.Game;
  audio: AudioPlayer;
  onExit: () => void;
  buildRevision?: string;
}

/** Owns one entire attempt. Battle mounting never replaces the session/history. */
export function mountRun(root: HTMLElement, request: StartRequest, options: RunMountOptions): () => void {
  const session = createRunSession(options.content, request, options.buildRevision);
  const frame = document.createElement('section'); frame.dataset.screen = 'run';
  const toolbar = document.createElement('nav'); toolbar.setAttribute('aria-label', 'Current attempt');
  toolbar.style.cssText = 'display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:8px;background:#15222e;color:#edf3f7;font:16px system-ui';
  const label = document.createElement('span');
  function button(text: string, id: string, action: () => void) {
    const node = document.createElement('button'); node.type = 'button'; node.textContent = text; node.dataset.control = id; node.onclick = action; toolbar.append(node); return node;
  }
  toolbar.append(label);
  const downloads = new Set<string>();
  button('Export record', 'export-record', () => {
    const record = session.exportRecord();
    const url = URL.createObjectURL(new Blob([`${JSON.stringify(record, null, 2)}\n`], { type: 'application/json' }));
    downloads.add(url);
    const link = document.createElement('a'); link.href = url;
    link.download = `poc-002-${record.run.kind}-r${record.finalState.revision}.json`;
    frame.append(link); link.click(); link.remove();
    // Keep the URL until disposal so the browser can finish reading the download.
  });
  button('Reset', 'reset-run', options.onExit);
  button('Return to selection', 'return-selection', options.onExit);
  const next = button('Continue', 'continue-run', () => {
    const result = session.commit({ kind: 'continue', expectedRevision: session.state.revision });
    if (result.ok) { disposeBattle(); disposeBattle = battle(); }
  });
  const summary = document.createElement('section'); summary.setAttribute('aria-label', 'Attempt result and carried state');
  summary.style.cssText = 'padding:12px;background:#15222e;color:#edf3f7;font:16px/1.5 system-ui';
  const arena = document.createElement('div');
  frame.append(toolbar, summary, arena); root.append(frame);
  // Arrow traversal from the attempt toolbar enters the existing battle controls.
  // Battle controls retain their own keyboard handler and native Tab behavior.
  toolbar.onkeydown = event => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
    const controls = Array.from(frame.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')).filter(n => n.getClientRects().length > 0);
    const index = controls.indexOf(document.activeElement as HTMLButtonElement);
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    controls[(index + step + controls.length) % controls.length]?.focus(); event.preventDefault();
  };
  function battle() {
    const state = session.state;
    return mountBattle(arena, session, { encounterId: state.run.encounters[state.fightIndex]!, party: state.run.party, start: state.run.start, game: options.game, audio: options.audio, onExit: options.onExit });
  }
  let disposeBattle = battle();
  const unsubscribe = session.subscribe(state => {
    frame.dataset.phase = state.phase; frame.dataset.fightIndex = String(state.fightIndex);
    label.textContent = `${state.run.kind} · Fight ${state.fightIndex + 1}/${state.run.encounters.length} · ${state.run.encounters[state.fightIndex]}`;
    next.hidden = state.phase !== 'between-fights'; next.disabled = next.hidden;
    summary.hidden = state.phase === 'player'; summary.replaceChildren();
    if (!summary.hidden) {
      const title = document.createElement('h2');
      title.textContent = state.phase === 'between-fights' ? 'Fight won — carried into the next fight' : state.phase === 'victory' ? 'Victory — attempt complete' : 'Defeat — attempt ended';
      summary.append(title);
      for (const b of state.party) {
        const row = document.createElement('p'); row.dataset.carriedBrood = b.id;
        row.textContent = `${b.id}: HP ${b.hp}/${b.maxHp} · Revelation ${b.revelation}/${b.revelationCap} · ${b.hp === 0 ? 'Dead — stays dead' : 'Alive'}`; summary.append(row);
      }
      const uses = document.createElement('p'); uses.textContent = `Salve uses remaining: ${state.salveUses}`; summary.append(uses);
      if (state.phase === 'between-fights') { const text = document.createElement('p'); text.textContent = `Next: ${state.run.encounters[state.fightIndex + 1]}. Choose Continue when ready.`; summary.append(text); }
    }
  });
  return () => { unsubscribe(); disposeBattle(); for (const url of downloads) URL.revokeObjectURL(url); frame.remove(); };
}
