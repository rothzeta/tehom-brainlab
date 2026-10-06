import Phaser from 'phaser';
import { CombatScene, createCombatShell } from '../../src/view/CombatScene';
import { collectorFixture } from './collector-fixtures';

if (typeof document !== 'undefined') {
  const mode = new URLSearchParams(location.search).get('mode') ?? 'trace';
  createCombatShell(document.querySelector<HTMLElement>('#app')!, 'collector');
  new Phaser.Game({ type: Phaser.CANVAS, parent: 'board-canvas', width: 620, height: 500,
    backgroundColor: '#16212b', scene: new CombatScene(preset => collectorFixture(mode, preset), 'collector') });
}
