import type { FightOptions, GauntletOptions } from '../../core/types';
import rawContent from '../../../content/combat-content.v1.json';
import { loadContent } from '../../core';
import { EMBLEM_CREDITS } from '../art';

export type StartRequest = ({ kind: 'fight' } & FightOptions) | ({ kind: 'gauntlet' } & GauntletOptions);
export type StartHandler = (request: StartRequest) => void;
/** Native form controls keep every party and launch choice keyboard accessible. */
export function mountSelect(root: HTMLElement, start: StartHandler): () => void {
  const content = loadContent(rawContent);
  const form = document.createElement('form');
  form.dataset.screen = 'select';
  form.style.cssText = 'font:16px/1.5 system-ui;padding:16px;color:#edf3f7;background:#15222e;max-width:800px';
  const heading = document.createElement('h2'); heading.textContent = 'Choose your attempt'; form.append(heading);
  const party = document.createElement('fieldset');
  const legend = document.createElement('legend'); legend.textContent = 'Party — choose one to three'; party.append(legend);
  const members = content.brood.map(b => {
    const label = document.createElement('label');
    const input = document.createElement('input'); input.type = 'checkbox'; input.value = b.id; input.checked = true; input.name = 'party';
    label.append(input, ` ${b.name} `); party.append(label); return { input, id: b.id };
  });
  form.append(party);
  function select<T extends string>(name: string, labelText: string, values: { id: T; label: string }[]) {
    const label = document.createElement('label'); label.textContent = `${labelText} `;
    const input = document.createElement('select'); input.name = name;
    for (const value of values) { const option = document.createElement('option'); option.value = value.id; option.textContent = value.label; input.append(option); }
    label.append(input); form.append(label, document.createElement('br')); return input;
  }
  const encounter = select('encounter', 'Encounter', content.encounters.map(e => ({ id: e.id, label: `${e.id}: ${e.enemies.map(id => content.enemies.find(e => e.id === id)!.name).join(' + ')}` })));
  const preset = select('start', 'Fight start', content.starts.map(s => ({ id: s.id, label: s.id })));
  const fight = document.createElement('button'); fight.type = 'submit'; fight.textContent = 'Start fight'; fight.dataset.control = 'start-fight';
  const gauntlet = document.createElement('button'); gauntlet.type = 'button'; gauntlet.textContent = 'Start gauntlet'; gauntlet.dataset.control = 'start-gauntlet';
  const description = document.createElement('p'); description.textContent = `Gauntlet: ${content.gauntlets[0]!.encounters.join(' → ')}. Fresh start; HP, Revelation, deaths and Salves carry between fights. Continue advances after victory.`;
  const message = document.createElement('p'); message.setAttribute('role', 'alert');
  const update = () => { const empty = !members.some(m => m.input.checked); fight.disabled = gauntlet.disabled = empty; message.textContent = empty ? 'Choose at least one Brood.' : ''; };
  form.onchange = update;
  const selected = () => members.filter(m => m.input.checked).map(m => m.id);
  form.onsubmit = event => { event.preventDefault(); if (!fight.disabled) start({ kind: 'fight', party: selected(), encounterId: content.encounters.find(e => e.id === encounter.value)!.id, start: content.starts.find(s => s.id === preset.value)!.id }); };
  gauntlet.onclick = () => { if (!gauntlet.disabled) start({ kind: 'gauntlet', party: selected() }); };
  form.append(fight, gauntlet, message, description);
  const credits = document.createElement('details');
  const summary = document.createElement('summary'); summary.textContent = 'Credits'; credits.append(summary, EMBLEM_CREDITS.text);
  for (const [label, href] of [['Artist', EMBLEM_CREDITS.artistUrl], ['Source', EMBLEM_CREDITS.sourceUrl], ['License', EMBLEM_CREDITS.licenseUrl], ['Full credits', EMBLEM_CREDITS.creditsUrl]]) {
    const link = document.createElement('a'); link.textContent = ` ${label} `; link.href = href!; link.style.color = '#9cddff'; credits.append(link);
  }
  form.append(credits); root.append(form);
  return () => form.remove();
}
