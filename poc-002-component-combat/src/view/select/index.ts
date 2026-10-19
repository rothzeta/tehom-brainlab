import type { FightOptions, GauntletOptions } from '../../core/types';

export type StartRequest = ({ kind: 'fight' } & FightOptions) | ({ kind: 'gauntlet' } & GauntletOptions);
export type StartHandler = (request: StartRequest) => void;
/** Q08 replaces this visible placeholder with selection and gauntlet flow. */
export function mountSelect(root: HTMLElement, _start: StartHandler): () => void {
  const message = document.createElement('p');
  message.dataset.screen = 'select';
  message.textContent = 'Combat selection — Q08';
  root.append(message);
  return () => message.remove();
}
