import Phaser from 'phaser';
import { CombatScene, createCombatShell } from '../../src/view/CombatScene';
import { repositioningFixture } from './repositioning-fixtures';

if (typeof document !== 'undefined') {
  const mode = new URLSearchParams(location.search).get('mode') ?? 'mobile';
  createCombatShell(document.querySelector<HTMLElement>('#app')!);
  new Phaser.Game({ type: Phaser.CANVAS, parent: 'board-canvas', width: 620, height: 500,
    backgroundColor: '#16212b', scene: new CombatScene(() => repositioningFixture(mode)) });
}
