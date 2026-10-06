import Phaser from 'phaser';
import { CombatScene, createCombatShell } from '../../src/view/CombatScene';
import { kitFixture } from './p14-fixtures';

if (typeof document !== 'undefined') {
  const mode = new URLSearchParams(location.search).get('mode') === 'one-partner' ? 'one-partner' : 'protected';
  createCombatShell(document.querySelector<HTMLElement>('#app')!);
  new Phaser.Game({ type: Phaser.CANVAS, parent: 'board-canvas', width: 620, height: 500,
    backgroundColor: '#16212b', scene: new CombatScene(preset => kitFixture(mode, preset)) });
}
