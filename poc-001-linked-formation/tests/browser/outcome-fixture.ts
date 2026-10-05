// Test-only entry, compiled in memory by the CDP driver; never imported by main.ts.
import Phaser from 'phaser';
import { CombatScene, createCombatShell } from '../../src/view/CombatScene';
import { outcomeFixture } from './fixtures';

const outcome = new URLSearchParams(location.search).get('outcome');
if (outcome !== 'victory' && outcome !== 'defeat') throw new Error('Test outcome required');
createCombatShell(document.querySelector<HTMLElement>('#app')!);
new Phaser.Game({ type: Phaser.CANVAS, parent: 'board-canvas', width: 620, height: 500,
  backgroundColor: '#16212b', scene: new CombatScene(() => outcomeFixture(outcome)) });
