// Test-owned encounter for native B2/B3 reproductions; no production route.
import Phaser from 'phaser';
import { createPatrol } from '../../src/content/patrol';
import { announcePatrol } from '../../src/core/rounds';
import { CombatScene, createCombatShell } from '../../src/view/CombatScene';
export function rfBugFixture() {
  const base = createPatrol('healthy', { warderDamage: 3, censerDamage: 3, harrierDamage: 4,
    isolatedHarrierDamage: 7, splashRadius: 2, closeThreshold: 2,
    damageRules: { directionalReduction: 2, shelterReduction: 2, closeThreshold: 2 } });
  return announcePatrol({ ...base,
    brood: base.brood.map(entity => ({ ...entity, hp: 100, maxHp: 100 })),
    enemies: base.enemies.map(entity => ({ ...entity, hp: 100, maxHp: 100 })) });
}
createCombatShell(document.querySelector<HTMLElement>('#app')!);
new Phaser.Game({ type: Phaser.CANVAS, parent: 'board-canvas', width: 620, height: 500,
  backgroundColor: '#16212b', scene: new CombatScene(rfBugFixture) });
