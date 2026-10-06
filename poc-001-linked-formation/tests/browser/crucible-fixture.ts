import Phaser from 'phaser';
import { CombatScene, createCombatShell } from '../../src/view/CombatScene';
import { crucibleFixture } from './crucible-fixtures';

if (typeof document !== 'undefined') {
  const mode = new URLSearchParams(location.search).get('mode') ?? 'threshold';
  createCombatShell(document.querySelector<HTMLElement>('#app')!, 'crucible');
  new Phaser.Game({ type: Phaser.CANVAS, parent: 'board-canvas', width: 620, height: 500,
    backgroundColor: '#16212b', scene: new CombatScene(preset => crucibleFixture(mode, preset), 'crucible') });
}
