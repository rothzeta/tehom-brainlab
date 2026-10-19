import { applyCommand } from '../core';
import type { BattleState, Command, Content } from '../core';
import { actions, hp } from './search';
import type { Line, Step } from './search';
export const POLICIES = ['always-disable', 'always-core', 'poison-then-Guard', 'Rapture-as-soon-as-possible', 'never-use-Revelation-skills', 'Revoke-every-Saw'] as const;
export type Policy = typeof POLICIES[number];
export function policyApplies(policy: Policy, state: BattleState): boolean {
  return policy === 'poison-then-Guard' ? state.party.some(b => b.id === 'girtablilu') : policy === 'Revoke-every-Saw' ? state.party.some(b => b.id === 'anzu') && state.run.encounters.includes('warden') : true;
}
/** Fixed, deterministic priorities, applied in roster order. All numbers below
 * are policy priorities, never combat tuning. Items heal the most wounded ally
 * when they restore their full content-defined amount. */
export function policyLine(c: Content, initial: BattleState, policy: Policy, depth: number, salves = true): Line {
  let s = initial; let rounds = initial.round; const steps: Step[] = [];
  const limit = depth * (s.party.length + 2) * s.run.encounters.length;
  for (let k = 0; k < limit && s.phase !== 'victory' && s.phase !== 'defeat' && s.round <= depth; k++) {
    const legal = actions(c, s, salves);
    const sawRevoke = policy === 'Revoke-every-Saw' ? legal.find(cmd => cmd.kind === 'act' && cmd.action === 'revoke' && cmd.target && 'intent' in cmd.target && s.intents.some(i => cmd.target && 'intent' in cmd.target && i.id === cmd.target.intent && i.kind === 'saw')) : undefined;
    const actor = sawRevoke?.kind === 'act' ? sawRevoke.actor : s.party.find(b => b.hp > 0 && !b.acted)?.id;
    let choices = legal.filter(a => a.kind !== 'act' || a.actor === actor);
    const rank = (cmd: Command): number => {
      if (cmd.kind === 'continue') return 10000;
      if (cmd.kind !== 'act') return -10000;
      const a = c.actions.find(a => a.id === cmd.action)!;
      const target = cmd.target;
      const part = target && 'part' in target ? s.enemies.find(e => e.id === target.enemy)!.parts.find(p => p.id === target.part)! : null;
      const damage = a.effect.kind === 'damage' || a.effect.kind === 'envenom' || a.effect.kind === 'rupture-venom';
      const core = part?.kind === 'body' || a.effect.kind === 'rupture-venom';
      const component = part?.kind === 'component';
      if (policy === 'never-use-Revelation-skills' && a.revelationCost > 0) return -20000;
      if (a.effect.kind === 'heal' && target && 'brood' in target) {
        const b = s.party.find(b => b.id === target.brood)!;
        return b.maxHp - b.hp >= a.effect.amount ? 9000 + b.maxHp - b.hp : -1000;
      }
      if (policy === 'Revoke-every-Saw' && a.id === 'revoke' && target && 'intent' in target && s.intents.find(i => i.id === target.intent)?.kind === 'saw') return 10000;
      if (policy === 'poison-then-Guard' && cmd.actor === 'girtablilu') {
        if (a.id === 'envenom' && target && 'enemy' in target && s.enemies.find(e => e.id === target.enemy)!.poison === 0) return 5000;
        if (a.id === 'guard') return 4000;
        return -1000;
      }
      if (policy === 'Rapture-as-soon-as-possible') return (s.party.find(b => b.id === cmd.actor)!.transformation ? 0 : a.revelationCost * 100) + (damage ? 20 : 0) + (core ? 5 : 0);
      if (policy === 'always-disable') return component && damage ? 2000 - part!.pool : core && damage ? 1000 : -100;
      return core && damage ? 2000 : component && damage ? 1000 : a.id === 'guard' ? 0 : -100;
    };
    choices = choices.filter(a => rank(a) > -20000).sort((a, b) => rank(b) - rank(a));
    const cmd = sawRevoke ?? choices[0] ?? legal.find(a => a.kind === 'endPhase')!;
    const result = applyCommand(c, s, cmd); if (!result.ok) throw new Error('Policy issued illegal command');
    steps.push({ before: s, command: cmd, events: result.events, state: result.state });
    if (cmd.kind === 'continue' || result.state.round > s.round) rounds++;
    s = result.state;
  }
  return { state: s, steps, rounds, hp: hp(s), outcome: s.phase === 'victory' ? 'victory' : 'no-win-found' };
}
