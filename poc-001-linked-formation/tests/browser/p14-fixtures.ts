import { createPatrol } from '../../src/content/patrol';
import type { PatrolPreset, PatrolState } from '../../src/content/patrol';
import { formations } from '../../src/core/formation';
import { selectProtection } from '../../src/core/intents';
import { announcePatrol } from '../../src/core/rounds';

/** Test-only state selection; keep patrol tuning and enemy layout owned by content. */
export function kitFixture(mode: 'protected' | 'one-partner', preset: PatrolPreset = 'healthy'): PatrolState {
  const base = createPatrol(preset);
  const formation = formations().find(formation => formation.shape === 'spread'
    && selectProtection({ ...base, formation }, { actorId: 'girtablilu', targetId: 'censer',
      bypassProtection: false }, base.protections).protected);
  if (!formation) throw new Error('No protected Spread fixture');
  return announcePatrol({ ...base, formation,
    brood: base.brood.map(entity => mode === 'one-partner' && entity.id === 'ugallu'
      ? { ...entity, hp: 0 } : entity) });
}
