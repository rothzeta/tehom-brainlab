import { ENEMY_CELLS } from './hex';
import type { Hex } from './hex';
import type { CombatState } from './state';

/** Provisional clockwise route through the reserved edge slots. */
export const ENEMY_ROUTE: readonly Hex[] = Object.freeze(ENEMY_CELLS.slice(1));

export type EnemyMovementEvent =
  | { readonly type: 'enemy-moved'; readonly sourceId: string; readonly round: number;
      readonly from: Hex; readonly to: Hex }
  | { readonly type: 'enemy-move-blocked'; readonly sourceId: string; readonly round: number;
      readonly cell: Hex; readonly reason: 'occupied' | 'off-route' };

const sameCell = (a: Hex, b: Hex) => a.q === b.q && a.r === b.r;

/** Pure round-boundary change; later movers see earlier destinations. */
export function relocateEnemies<State extends CombatState>(state: State): {
  state: State; events: readonly EnemyMovementEvent[];
} {
  const enemies = [...state.enemies];
  const events: EnemyMovementEvent[] = [];
  for (const [index, enemy] of enemies.entries()) {
    if (!enemy.mobile || enemy.hp <= 0) continue;
    const slot = ENEMY_ROUTE.findIndex(cell => sameCell(cell, enemy.cell));
    const destination = slot < 0 ? undefined : [1, -1]
      .map(step => ENEMY_ROUTE[(slot + step + ENEMY_ROUTE.length) % ENEMY_ROUTE.length]!)
      .find(cell => !enemies.some(other => other.hp > 0 && sameCell(cell, other.cell)));
    if (!destination) {
      events.push({ type: 'enemy-move-blocked', sourceId: enemy.id, round: state.round,
        cell: enemy.cell, reason: slot < 0 ? 'off-route' : 'occupied' });
      continue;
    }
    enemies[index] = { ...enemy, cell: destination };
    events.push({ type: 'enemy-moved', sourceId: enemy.id, round: state.round,
      from: enemy.cell, to: destination });
  }
  return { state: events.length ? { ...state, enemies } : state, events };
}
