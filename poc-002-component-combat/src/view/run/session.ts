import { createFight, createGauntlet } from '../../core';
import type { Content } from '../../core/types';
import type { StartRequest } from '../select';
import { createSession } from '../session';

/** Each launch owns a fresh initial state and accepted-command history (§§10,12). */
export function createRunSession(content: Content, request: StartRequest, buildRevision = 'unknown') {
  const initial = request.kind === 'fight'
    ? createFight(content, { encounterId: request.encounterId, party: request.party, start: request.start })
    : createGauntlet(content, { party: request.party });
  return createSession(content, initial, buildRevision);
}
