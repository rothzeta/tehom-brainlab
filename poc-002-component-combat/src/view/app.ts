import Phaser from 'phaser';
import rawContent from '../../content/combat-content.v1.json';
import { loadContent } from '../core/content';
import type { FightOptions } from '../core/types';
import { createAudio } from '../audio';
import { mountRun } from './run';
import { mountSelect } from './select';
import type { StartHandler } from './select';

/** One shared Phaser game/audio player across selection and complete attempts. */
export function mountApp(root: HTMLElement): () => void {
  const content = loadContent(rawContent);
  const buildRevision = import.meta.env.VITE_POC002_BUILD_REVISION || 'unknown';
  const title = document.createElement('h1'); title.textContent = 'TEHOM — Component Combat';
  const panel = document.createElement('section'); panel.setAttribute('aria-label', 'Combat screen');
  const stage = document.createElement('div'); stage.id = 'combat-canvas';
  stage.style.cssText = 'width:100%;max-width:1280px;aspect-ratio:16/9';
  root.append(title, panel, stage);
  const game = new Phaser.Game({
    type: Phaser.CANVAS, parent: stage, width: 1280, height: 720,
    backgroundColor: '#1d2d3c', scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: { create() { this.add.text(640, 360, 'Component combat — Q01 scaffold', { fontSize: '28px', color: '#eeeeee' }).setOrigin(0.5); } },
  });
  const audio = createAudio();
  const query = new URLSearchParams(location.search);
  let dispose: () => void = () => {};
  const onExit = () => {
    dispose();
    history.replaceState(null, '', location.pathname);
    dispose = mountSelect(panel, start);
  };
  const start: StartHandler = request => {
    dispose();
    dispose = mountRun(panel, request, { content, game, audio, onExit, buildRevision });
  };
  if (query.get('screen') === 'battle') {
    const encounter = content.encounters.find(e => e.id === (query.get('encounter') ?? 'guard'));
    const requested = (query.get('party') ?? content.brood.map(b => b.id).join(',')).split(',');
    const party = content.brood.filter(b => requested.includes(b.id)).map(b => b.id);
    const preset = content.starts.find(s => s.id === (query.get('start') ?? 'fresh'));
    if (!encounter || !preset || !party.length || new Set(requested).size !== requested.length || party.length !== requested.length) {
      panel.textContent = 'Invalid battle URL: choose a known encounter, start and distinct party.';
      dispose = () => { panel.textContent = ''; };
    } else {
      const options: FightOptions = { encounterId: encounter.id, party, start: preset.id };
      dispose = mountRun(panel, { kind: 'fight', ...options }, { content, game, audio, onExit, buildRevision });
    }
  } else dispose = mountSelect(panel, start);
  return () => { dispose(); game.destroy(true); root.replaceChildren(); };
}
