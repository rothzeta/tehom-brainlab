// Test-owned declarations: ordinary P08 patrols never announce fixed-area attacks.
// No product route loads this entry. Browser controls still use the real scene/adapter.
import Phaser from 'phaser';
import { CombatScene, createCombatShell } from '../../src/view/CombatScene';
import { fixedAreaFixture } from './fixtures';

if (typeof document !== 'undefined') {
  createCombatShell(document.querySelector<HTMLElement>('#app')!);
  new Phaser.Game({ type: Phaser.CANVAS, parent: 'board-canvas', width: 620, height: 500,
    backgroundColor: '#16212b', scene: new CombatScene(fixedAreaFixture) });
}
