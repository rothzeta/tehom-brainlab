import Phaser from 'phaser';
import { boardCells } from '../core/hex';
import { formations, formationPositions, ROSTER } from '../core/formation';
import type { Brood } from '../core/formation';
import { LabSession, MANEUVERS, MANEUVER_LABELS } from './lab-state';
import { projectHex } from './projection';
import './lab.css';
import { createPatrol } from '../content/patrol';
import { createInitialState } from '../core/state';

const PROJECTION = { x: 380, y: 295, spacing: 120 };
const COLORS = { ugallu: 0xffc775, girtablilu: 0x81d5c5, pazuzu: 0xb7b0ff };
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}tehom/${path}`;
const title = (value: string) => value[0]!.toUpperCase() + value.slice(1);

export function createLabShell(parent: HTMLElement): void {
  parent.innerHTML = `
    <main id="formation-lab">
      <header><div><h1>TEHOM — Formation Lab</h1><p>Inspect three linked Brood. One rotation and one shape change per fresh fixture.</p></div><span class="lab-tag">FORMATION ONLY</span></header>
      <div class="lab-columns">
        <section aria-label="Formation board" class="board-panel">
          <div id="board-stage"><div id="board-canvas"></div><div id="ghosts" aria-hidden="true"></div><div id="tokens"></div></div>
          <p class="legend">${boardCells().length} cells · <span>━ Close</span><span>┄ Stretched</span><span>◌ Pending destination</span> · Fixed centre; no individual movement.</p>
        </section>
        <aside aria-label="Lab controls">
          <h2>Live formation</h2><p id="live-readout" aria-live="polite"></p>
          <label for="fixture">Test setup — fresh lab fixture</label><select id="fixture"></select>
          <h2>Maneuvers</h2><p class="hint">Hover or focus to preview. Click or press Enter to commit.</p>
          <div id="maneuvers"></div><p id="allowance" role="status"></p>
          <p id="preview-readout" aria-live="polite"></p>
          <div class="secondary"><button id="cancel" type="button">Cancel preview (Esc)</button><button id="reset" type="button">Reset lab</button></div>
          <h2>Selected Brood</h2><p id="selection">Select a labelled token to inspect it.</p>
          <h2>Live links</h2><ul id="link-readout"></ul>
          <label class="placeholder"><input id="placeholder" type="checkbox"> Placeholder mode — labels only</label>
        </aside>
      </div>
      <section id="combat-preview" aria-label="Patrol preview fixture" hidden></section>
      <footer><details id="credits"><summary>Emblem credits &amp; patrol reference</summary>
        <p>Icons made by <a href="http://lorcblog.blogspot.com/">Lorc</a>. Available at <a href="https://game-icons.net">Game-icons.net</a>. Licensed under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Backgrounds removed; dimensions and attribution metadata added. Symbolic POC emblems.</p>
        <div id="patrol-emblems"></div><p><a id="credits-file">Bundled credits</a> · <a id="license-file">Bundled license</a></p>
      </details></footer>
    </main>`;
}

/** Generated canvas board with native keyboard-accessible inspection and controls. */
export class FormationLab extends Phaser.Scene {
  private readonly lab = new LabSession(() => new URLSearchParams(location.search).get('preview') === 'patrol'
    ? createPatrol() : createInitialState());
  private root!: HTMLElement;
  private graphics!: Phaser.GameObjects.Graphics;
  private linkLabels: Phaser.GameObjects.Text[] = [];
  private tokenButtons = new Map<Brood, HTMLButtonElement>();
  private maneuverButtons = new Map<string, HTMLButtonElement>();
  private placeholder = false;

  constructor() { super('formation-lab'); }

  private element<T extends HTMLElement = HTMLElement>(id: string): T {
    return this.root.querySelector<T>(`#${id}`)!;
  }

  create(): void {
    this.root = document.querySelector<HTMLElement>('#formation-lab')!;
    this.graphics = this.add.graphics();
    this.placeholder = new URLSearchParams(location.search).get('placeholder') === '1';
    const fixture = this.element<HTMLSelectElement>('fixture');
    const fixtures = formations();
    fixtures.forEach((formation, index) => fixture.add(new Option(`${title(formation.shape)} · orientation ${formation.orientation}`, String(index))));
    fixture.addEventListener('change', () => { this.lab.selectFixture(fixtures[Number(fixture.value)]!); this.render(); });
    for (const maneuver of MANEUVERS) {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = MANEUVER_LABELS[maneuver]; button.dataset.maneuver = maneuver;
      button.addEventListener('pointerenter', () => { if (!button.disabled) { this.lab.previewManeuver(maneuver); this.render(); } });
      button.addEventListener('focus', () => { this.lab.previewManeuver(maneuver); this.render(); });
      button.addEventListener('pointerleave', () => { if (document.activeElement !== button) { this.lab.cancel(); this.render(); } });
      button.addEventListener('blur', () => { this.lab.cancel(); this.render(); });
      button.addEventListener('click', () => { this.lab.commit(maneuver); this.render(); });
      this.maneuverButtons.set(maneuver, button); this.element('maneuvers').append(button);
    }
    for (const brood of ROSTER) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'brood-token'; button.dataset.brood = brood;
      button.style.setProperty('--brood-color', `#${COLORS[brood].toString(16)}`);
      button.append(this.emblem(brood), Object.assign(document.createElement('span'), { textContent: title(brood) }));
      button.addEventListener('click', () => { this.lab.select(brood); this.render(); });
      this.tokenButtons.set(brood, button); this.element('tokens').append(button);
    }
    this.element('cancel').addEventListener('click', () => { this.lab.cancel(); this.render(); });
    this.element('reset').addEventListener('click', () => { this.lab.reset(); fixture.value = '0'; this.render(); });
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { this.lab.cancel(); this.render(); } };
    document.addEventListener('keydown', escape);
    this.events.once('shutdown', () => document.removeEventListener('keydown', escape));
    const placeholder = this.element<HTMLInputElement>('placeholder');
    placeholder.checked = this.placeholder;
    placeholder.addEventListener('change', () => { this.placeholder = placeholder.checked; this.updateArtwork(); });
    for (const id of [...ROSTER, 'warder', 'censer', 'harrier']) {
      const item = document.createElement('div'); item.append(this.emblem(id), document.createTextNode(title(id)));
      this.element('patrol-emblems').append(item);
    }
    this.element<HTMLAnchorElement>('credits-file').href = assetUrl('CREDITS.md');
    this.element<HTMLAnchorElement>('license-file').href = assetUrl('licenses/game-icons-license.txt');
    this.updateArtwork(); this.render();
  }

  private emblem(id: string): HTMLElement {
    const frame = document.createElement('span'); frame.className = 'emblem'; frame.dataset.asset = id;
    const image = document.createElement('img'); image.alt = ''; image.draggable = false;
    image.addEventListener('error', () => { image.hidden = true; frame.dataset.art = 'fallback'; frame.title = `${title(id)} — image unavailable; labelled placeholder`; });
    image.addEventListener('load', () => { if (!this.placeholder) { image.hidden = false; frame.dataset.art = 'loaded'; } });
    frame.append(image); return frame;
  }

  private updateArtwork(): void {
    this.root.querySelectorAll<HTMLElement>('.emblem').forEach((frame) => {
      const image = frame.querySelector('img')!;
      image.hidden = this.placeholder;
      if (this.placeholder) { image.removeAttribute('src'); frame.dataset.art = 'placeholder'; }
      else { image.src = assetUrl(`tokens/${frame.dataset.asset}.svg`); frame.dataset.art = 'loading'; }
    });
  }

  private render(): void {
    const state = this.lab.state;
    this.root.dataset.revision = String(state.revision);
    this.root.dataset.rotationUsed = String(state.rotationUsed);
    this.root.dataset.shapeChangeUsed = String(state.shapeChangeUsed);
    this.element('live-readout').textContent = `${title(state.formation.shape)} · orientation ${state.formation.orientation} · revision ${state.revision} · round ${state.round}`;
    this.element('allowance').textContent = `Rotation: ${state.rotationUsed ? 'used' : 'available'}. Shape change: ${state.shapeChangeUsed ? 'used' : 'available'}.`;
    for (const maneuver of MANEUVERS) {
      const result = this.lab.outcome(maneuver);
      const button = this.maneuverButtons.get(maneuver)!;
      button.disabled = !result.ok;
      button.title = result.ok ? 'Preview, then commit once' : result.error.code === 'same-shape' ? `Already ${state.formation.shape}` : `${maneuver === 'clockwise' || maneuver === 'anticlockwise' ? 'Rotation' : 'Shape change'} already used`;
      button.setAttribute('aria-describedby', 'allowance');
    }
    this.drawBoard();
    for (const position of this.lab.positions) {
      const pixel = projectHex(position.cell, PROJECTION); const button = this.tokenButtons.get(position.brood)!;
      button.style.left = `${pixel.x}px`; button.style.top = `${pixel.y}px`;
      button.dataset.q = String(position.cell.q); button.dataset.r = String(position.cell.r);
      button.setAttribute('aria-pressed', String(this.lab.selected === position.brood));
      button.setAttribute('aria-label', `${title(position.brood)} at (${position.cell.q}, ${position.cell.r})`);
    }
    const selected = this.lab.positions.find((position) => position.brood === this.lab.selected);
    this.element('selection').textContent = selected ? `${title(selected.brood)} · (${selected.cell.q}, ${selected.cell.r}) · ${title(state.formation.shape)} / ${state.formation.orientation}` : 'Select a labelled token to inspect it.';
    this.element('link-readout').replaceChildren(...this.lab.links.map((link) => {
      const li = document.createElement('li'); li.textContent = `${title(link.from.brood)} ↔ ${title(link.to.brood)}: ${title(link.state)} (${link.distance})`; li.dataset.state = link.state; return li;
    }));
    const pending = this.lab.preview;
    const combatPanel = this.element('combat-preview');
    combatPanel.hidden = !('enemies' in state);
    if (!combatPanel.hidden) {
      const hp = (snapshot: typeof state) => snapshot.brood.map((entity) => `${title(entity.brood)} ${entity.hp}/${entity.maxHp}`).join(' · ');
      const preview = pending?.projection;
      const lines = [`Patrol preview fixture — maneuvers only. Live: ${hp(state)}.`];
      if (preview?.ok) {
        const facts = preview.projection.after;
        lines.push(`Immediate: ${hp(preview.state)} · ${preview.state.phase}.`);
        const before = preview.projection.before;
        if (before.available && facts.available) {
          lines.push(`Destination links: ${facts.links.map((link) => `${link.from.brood} ↔ ${link.to.brood} ${link.state}`).join('; ')}.`);
          lines.push(`Protection gained: ${preview.projection.protectionGained.map((entry) => `${entry.actorId} → ${entry.targetId}`).join(', ') || 'none'}; lost: ${preview.projection.protectionLost.map((entry) => `${entry.actorId} → ${entry.targetId}`).join(', ') || 'none'}.`);
          lines.push(`Threats: ${facts.threats.map((entry) => `${entry.intention.kind === 'fixed-area' ? 'Area' : 'Mark'} ${entry.intention.id} at ${entry.cells.map((cell) => `(${cell.q},${cell.r})`).join(', ')} → ${entry.recipientIds.join(', ') || entry.reason}`).join('; ')}.`);
          const abilityNames = (entries: typeof facts.abilities) => [...new Set(entries.map((entry) => title(entry.request.abilityId)))].join(', ') || 'none';
          lines.push(`Abilities enabled: ${abilityNames(preview.projection.abilitiesEnabled)}; disabled: ${abilityNames(preview.projection.abilitiesDisabled)}.`);
        } else {
          const reason = !facts.available ? facts.reason : !before.available ? before.reason : '';
          lines.push(`Preview facts unavailable: ${reason}.`);
        }
        const forecast = preview.forecast;
        lines.push(forecast.kind === 'transition' ? forecast.ok
          ? `${forecast.condition}: ${hp(forecast.state)} · ${forecast.state.phase}. Remaining player choices are excluded.`
          : `${forecast.condition}: unavailable (${forecast.error.code}).`
          : `${forecast.condition}: ${forecast.kind === 'terminal' ? 'combat ended; no enemy damage' : 'unavailable'}.`);
      } else lines.push('Hover or focus a maneuver to preview its immediate result and conditional enemy phase.');
      combatPanel.replaceChildren(...lines.map((line) => Object.assign(document.createElement('p'), { textContent: line })));
    }
    this.element('preview-readout').textContent = pending ? `Preview: ${MANEUVER_LABELS[pending.maneuver]} → ${title(pending.state.formation.shape)} / ${pending.state.formation.orientation}. Live state unchanged.` : 'No pending maneuver.';
    this.element('ghosts').replaceChildren(...(pending ? formationPositions(pending.state.formation).map((position) => {
      const pixel = projectHex(position.cell, PROJECTION); const ghost = document.createElement('span');
      ghost.className = 'ghost';
      const caption = document.createElement('span'); caption.textContent = `${title(position.brood)} destination`; ghost.append(caption);
      ghost.dataset.brood = position.brood; ghost.dataset.q = String(position.cell.q); ghost.dataset.r = String(position.cell.r);
      ghost.style.left = `${pixel.x}px`; ghost.style.top = `${pixel.y}px`; return ghost;
    }) : []));
  }

  private drawBoard(): void {
    const graphics = this.graphics; graphics.clear();
    this.linkLabels.forEach((label) => label.destroy()); this.linkLabels = [];
    const radius = PROJECTION.spacing / Math.sqrt(3);
    for (const cell of boardCells()) {
      const pixel = projectHex(cell, PROJECTION);
      const points = Array.from({ length: 6 }, (_, index) => {
        const angle = (30 + index * 60) * Math.PI / 180;
        return new Phaser.Math.Vector2(pixel.x + Math.cos(angle) * radius, pixel.y + Math.sin(angle) * radius);
      });
      graphics.fillStyle(0x1c2833, 1); graphics.fillPoints(points, true);
      graphics.lineStyle(1, 0x43515d, 1); graphics.strokePoints(points, true);
    }
    this.element('board-stage').dataset.cells = String(boardCells().length);
    graphics.lineStyle(1, 0x8fa2b0, 1); graphics.strokeCircle(PROJECTION.x, PROJECTION.y, 8);
    this.lab.links.forEach((link) => {
      const a = projectHex(link.from.cell, PROJECTION), b = projectHex(link.to.cell, PROJECTION);
      graphics.lineStyle(3, link.state === 'close' ? 0xb7c8d3 : 0xe2b681, 1);
      if (link.state === 'close') graphics.lineBetween(a.x, a.y, b.x, b.y);
      else {
        const length = Math.hypot(b.x - a.x, b.y - a.y);
        for (let offset = 0; offset < length; offset += 16) {
          const end = Math.min(offset + 9, length);
          graphics.lineBetween(a.x + (b.x-a.x)*offset/length, a.y + (b.y-a.y)*offset/length, a.x + (b.x-a.x)*end/length, a.y + (b.y-a.y)*end/length);
        }
      }
      const dx = b.x-a.x, dy = b.y-a.y, length = Math.hypot(dx,dy);
      let offset = 24;
      if (this.lab.state.formation.shape === 'compact') {
        const third = this.lab.positions.find(({ brood }) => brood !== link.from.brood && brood !== link.to.brood)!;
        const c = projectHex(third.cell, PROJECTION);
        // Choose the perpendicular pointing away from the triangle's third vertex.
        const towardThird = -dy * (c.x - (a.x + b.x) / 2) + dx * (c.y - (a.y + b.y) / 2);
        offset = towardThird > 0 ? -60 : 60;
      }
      this.linkLabels.push(this.add.text((a.x+b.x)/2 - dy/length*offset, (a.y+b.y)/2 + dx/length*offset, title(link.state), {
        fontFamily: 'sans-serif', fontSize: '14px', color: '#f0eee6', backgroundColor: '#121820', padding: { x: 4, y: 3 },
      }).setOrigin(0.5));
    });
  }
}
