import Phaser from 'phaser';
import { ABILITIES } from '../content/brood';
import type { AbilityId } from '../content/brood';
import { createPatrol, PATROL_VIEW_ANCHOR } from '../content/patrol';
import type { PatrolPreset } from '../content/patrol';
import { boardCells } from '../core/hex';
import { frontMask } from '../core/sectors';
import { previewFacts } from '../core/preview';
import type { PreviewFacts } from '../core/preview';
import type { Command, GameplayEvent } from '../core/commands';
import { MANEUVERS, MANEUVER_LABELS } from './lab-state';
import { projectHex } from './projection';
import { PatrolSession } from './patrol-session';
import './lab.css';
import './combat.css';

const PROJECTION = { x: 310, y: 240, spacing: 102 };
// Presentation offsets only; there are no enemy board coordinates or movement rules.
const CLUSTER = [{ x: -44, y: -29 }, { x: 44, y: -29 }, { x: 0, y: 37 }];
const title = (id: string) => id[0]!.toUpperCase() + id.slice(1);
const hpText = (state: PatrolSession['state']) => [...state.brood, ...state.enemies]
  .map(entity => `${title(entity.id)} ${entity.hp}/${entity.maxHp}`).join(' · ');
const pair = (entry: { actorId: string; targetId: string }) => `${entry.actorId} → ${entry.targetId}`;

export function createCombatShell(parent: HTMLElement): void {
  parent.innerHTML = `<main id="patrol">
    <header><div><h1>TEHOM — Patrol</h1><p>Three linked Brood. Inspect intentions, then choose your actions.</p></div><a href="?">Formation lab</a></header>
    <div class="patrol-columns"><section class="board-panel" aria-label="Patrol board">
      <div id="board-stage"><div id="board-canvas"></div><div id="ghosts" aria-hidden="true"></div><div id="tokens"></div></div>
      <p class="legend">19 cells · ━ Close · ┄ Stretched · red: enemy front / mark · ◌ preview destination</p>
      <h2 id="battle-status" role="status"></h2><p id="links"></p><p id="shelters"></p>
    </section><aside aria-label="Patrol controls">
      <div class="setup"><label>Start a fresh patrol<select id="preset"><option value="healthy">Healthy</option><option value="wounded-ugallu">Wounded Ugallu</option><option value="wounded-girtablilu">Wounded Girtablilu</option></select></label><button id="reset">Restart patrol</button></div>
      <h2>Enemy intentions — resolution order</h2><ol id="intentions"></ol><p id="protection"></p>
      <h2>Player actions</h2><div id="actors"></div><div id="abilities"></div>
      <div id="targets" aria-label="Ability targets"></div><p id="selection"></p>
      <div class="secondary"><button id="confirm">Confirm ability</button><button id="cancel">Cancel (Esc)</button></div>
      <h2>Shared maneuver</h2><div id="maneuvers"></div><p id="allowance"></p>
      <button id="end-phase"></button><p id="feedback" aria-live="polite"></p>
      <label class="placeholder"><input id="placeholder" type="checkbox"> Placeholder mode — labels only</label>
    </aside></div>
    <section id="projection" aria-label="Command preview" aria-live="polite"></section>
    <details id="history"><summary>Last action and enemy resolution</summary><ol id="events"></ol></details>
    <footer><details><summary>Emblem credits</summary><p>Icons by <a href="http://lorcblog.blogspot.com/">Lorc</a> at <a href="https://game-icons.net">Game-icons.net</a>, <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Backgrounds removed; attribution metadata added. <a href="./tehom/CREDITS.md">Bundled credits</a> · <a href="./tehom/licenses/game-icons-license.txt">License</a>.</p></details></footer>
  </main>`;
}

export class CombatScene extends Phaser.Scene {
  private readonly session: PatrolSession;
  private root!: HTMLElement;
  private graphics!: Phaser.GameObjects.Graphics;
  private actor: string | undefined;
  private ability: AbilityId | undefined;
  private target: string | undefined;
  private direction: 'clockwise' | 'anticlockwise' = 'clockwise';
  private placeholder = new URLSearchParams(location.search).get('placeholder') === '1';
  private controlsKey = '';
  private tokens = new Map<string, HTMLButtonElement>();
  private maneuvers = new Map<string, HTMLButtonElement>();
  constructor(factory = createPatrol) { super('patrol'); this.session = new PatrolSession(() => this.render(), 400, factory); }
  private el<T extends HTMLElement = HTMLElement>(id: string): T { return this.root.querySelector<T>(`#${id}`)!; }
  private button(label: string, click: () => void): HTMLButtonElement {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
    button.addEventListener('click', click); return button;
  }
  create(): void {
    this.root = document.querySelector<HTMLElement>('#patrol')!;
    this.graphics = this.add.graphics();
    for (const entity of [...this.session.state.brood, ...this.session.state.enemies]) {
      const button = this.button('', () => {
        if (this.ability) this.chooseTarget(entity.id);
        else if (this.session.state.brood.some(brood => brood.id === entity.id)) this.chooseActor(entity.id);
        else { this.target = entity.id; this.render(); }
      });
      button.className = 'brood-token'; button.dataset.entity = entity.id;
      button.style.setProperty('--brood-color', this.session.state.brood.some(brood => brood.id === entity.id) ? '#acdcca' : '#ffb4aa');
      const frame = document.createElement('span'); frame.className = 'emblem';
      const image = document.createElement('img'); image.alt = ''; image.draggable = false;
      image.addEventListener('error', () => { image.hidden = true; frame.dataset.art = 'fallback'; });
      image.addEventListener('load', () => { if (!this.placeholder) { image.hidden = false; frame.dataset.art = 'loaded'; } });
      frame.append(image); button.append(frame, document.createElement('span'));
      this.tokens.set(entity.id, button); this.el('tokens').append(button);
    }
    for (const maneuver of MANEUVERS) {
      const command = () => ({ kind: 'maneuver' as const, expectedRevision: this.session.state.revision, maneuver });
      const button = this.button(MANEUVER_LABELS[maneuver], () => this.session.activate(command()));
      button.dataset.maneuver = maneuver; this.previewOn(button, command);
      this.maneuvers.set(maneuver, button); this.el('maneuvers').append(button);
    }
    const end = this.el<HTMLButtonElement>('end-phase');
    const endCommand = () => ({ kind: 'endPhase' as const, expectedRevision: this.session.state.revision });
    this.previewOn(end, endCommand);
    end.addEventListener('click', () => this.session.activate(endCommand()));
    this.el('confirm').addEventListener('click', () => {
      const command = this.abilityCommand();
      if (command) this.session.activate(command);
    });
    this.el('cancel').addEventListener('click', () => this.session.cancel());
    const reset = () => { this.actor = this.ability = this.target = undefined; this.direction = 'clockwise'; this.session.reset(this.el<HTMLSelectElement>('preset').value as PatrolPreset); };
    this.el('reset').addEventListener('click', reset); this.el('preset').addEventListener('change', reset);
    const checkbox = this.el<HTMLInputElement>('placeholder'); checkbox.checked = this.placeholder;
    checkbox.addEventListener('change', () => { this.placeholder = checkbox.checked; this.artwork(); });
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') this.session.cancel(); };
    document.addEventListener('keydown', escape);
    this.events.once('shutdown', () => { document.removeEventListener('keydown', escape); this.session.reset(); });
    this.artwork(); this.render();
  }
  private artwork(): void {
    for (const [id, button] of this.tokens) {
      const frame = button.querySelector<HTMLElement>('.emblem')!, image = frame.querySelector('img')!;
      image.hidden = this.placeholder;
      if (this.placeholder) { image.removeAttribute('src'); frame.dataset.art = 'placeholder'; }
      else { frame.dataset.art = 'loading'; image.src = `${import.meta.env.BASE_URL}tehom/tokens/${id}.svg`; }
    }
  }
  private previewOn(button: HTMLButtonElement, command: () => Command): void {
    for (const event of ['pointerenter', 'focus']) button.addEventListener(event, () => { if (!button.disabled) this.session.preview(command()); });
  }
  private chooseActor(id: string): void {
    if (this.session.busy) return;
    this.actor = id; this.ability = undefined; this.target = undefined; this.session.cancel();
  }
  private abilityCommand(targetId = this.target): Extract<Command, { kind: 'useAbility' }> | undefined {
    if (!this.actor || !this.ability || !targetId) return;
    return { kind: 'useAbility', expectedRevision: this.session.state.revision, actorId: this.actor,
      abilityId: this.ability, targetId, ...(this.ability === 'crosswind' ? { direction: this.direction } : {}) };
  }
  private chooseTarget(id: string): void {
    if (this.session.busy) return;
    this.target = id; const command = this.abilityCommand();
    if (command) this.session.preview(command); else this.render();
  }
  private availability(button: HTMLButtonElement, reason: string | undefined): void {
    button.disabled = !!reason; button.title = reason ?? 'Available'; button.dataset.reason = reason ?? '';
    const base = button.dataset.label ?? button.textContent!; button.dataset.label = base;
    button.textContent = reason ? `${base} (${reason})` : base;
  }
  private render(): void {
    if (!this.root) return;
    const state = this.session.state, facts = previewFacts(state);
    const locked = this.session.busy ? 'Resolving action' : state.phase !== 'player' ? `Battle ${state.phase}` : undefined;
    this.root.dataset.revision = String(state.revision); this.root.dataset.phase = state.phase; this.root.dataset.busy = String(this.session.busy);
    this.root.dataset.round = String(state.round);
    this.el('battle-status').textContent = `${title(state.phase)} · Round ${state.round} · ${title(state.formation.shape)} / ${state.formation.orientation}`;
    const positions = facts.available ? facts.positions : [];
    for (const [id, button] of this.tokens) {
      const entity = [...state.brood, ...state.enemies].find(entity => entity.id === id)!;
      const position = positions.find(position => position.brood === id);
      const anchor = projectHex(position?.cell ?? PATROL_VIEW_ANCHOR, PROJECTION);
      const offset = position ? { x: 0, y: 0 } : CLUSTER[state.enemies.findIndex(enemy => enemy.id === id)]!;
      button.style.left = `${anchor.x + offset.x}px`; button.style.top = `${anchor.y + offset.y}px`;
      button.dataset.hp = String(entity.hp); button.dataset.maxHp = String(entity.maxHp);
      if (position) { button.dataset.q = String(position.cell.q); button.dataset.r = String(position.cell.r); }
      button.lastElementChild!.textContent = `${title(id)} ${entity.hp}/${entity.maxHp}`;
      button.setAttribute('aria-label', `${title(id)}, HP ${entity.hp}/${entity.maxHp}`);
      button.setAttribute('aria-pressed', String(this.actor === id || this.target === id));
      button.dataset.fallen = String(entity.hp <= 0);
    }
    const controlsKey = JSON.stringify([state.revision, locked, this.actor, this.ability]);
    if (controlsKey !== this.controlsKey) {
      this.controlsKey = controlsKey;
      this.el('actors').replaceChildren(...state.brood.map(entity => {
        const button = this.button(`${title(entity.id)} ${entity.hp}/${entity.maxHp}`, () => this.chooseActor(entity.id)); button.dataset.actor = entity.id;
        const choices = facts.available ? facts.abilities.filter(entry => entry.request.actorId === entity.id) : [];
        const legal = choices.some(entry => entry.legality.ok);
        const rejected = choices.find(entry => !entry.legality.ok);
        this.availability(button, locked ?? (legal ? undefined : rejected && !rejected.legality.ok ? rejected.legality.error.code : 'Unavailable'));
        return button;
      }));
      this.el('abilities').replaceChildren(...(Object.keys(ABILITIES) as AbilityId[]).filter(id => ABILITIES[id].brood === this.actor).map(id => {
        const button = this.button(ABILITIES[id].name, () => { this.ability = id; this.target = undefined; this.session.cancel(); }); button.dataset.ability = id;
        const options = facts.available ? facts.abilities.filter(entry => entry.request.actorId === this.actor && entry.request.abilityId === id) : [];
        const rejected = options.find(entry => !entry.legality.ok);
        this.availability(button, locked ?? (options.some(entry => entry.legality.ok) ? undefined : rejected && !rejected.legality.ok ? rejected.legality.error.code : 'Unavailable'));
        button.setAttribute('aria-pressed', String(this.ability === id)); return button;
      }));
      const targets = facts.available ? facts.abilities.filter(entry => entry.request.actorId === this.actor && entry.request.abilityId === this.ability) : [];
      this.el('targets').replaceChildren(...targets.map(entry => {
        const button = this.button(`${title(entry.request.targetId)}${entry.request.direction ? ` · ${entry.request.direction}` : ''}`, () => {
          this.direction = entry.request.direction ?? 'clockwise'; this.chooseTarget(entry.request.targetId);
        });
        button.dataset.target = entry.request.targetId; if (entry.request.direction) button.dataset.direction = entry.request.direction;
        this.availability(button, locked ?? (entry.legality.ok ? undefined : entry.legality.error.code));
        this.previewOn(button, () => ({ kind: 'useAbility', ...entry.request })); return button;
      }));
    }
    this.el('selection').textContent = `Selected: ${this.actor ?? 'Brood'} / ${this.ability ?? 'ability'} / ${this.target ?? 'target'}${this.ability === 'crosswind' ? ` / ${this.direction}` : ''}. Selection spends no action.`;
    for (const maneuver of MANEUVERS) {
      const result = this.session.project({ kind: 'maneuver', expectedRevision: state.revision, maneuver });
      this.availability(this.maneuvers.get(maneuver)!, locked ?? (result.ok ? undefined : result.error.code));
    }
    this.el('allowance').textContent = state.maneuverUsed ? 'Shared maneuver used for this round.' : 'One shared maneuver available.';
    const unused = state.brood.filter(entity => entity.hp > 0 && !state.actedIds.includes(entity.id)).length;
    const end = this.el<HTMLButtonElement>('end-phase'); end.dataset.label = `End phase (${unused} actions unused)`;
    const endPreview = this.session.project({ kind: 'endPhase', expectedRevision: state.revision });
    this.availability(end, locked ?? (endPreview.ok ? undefined : endPreview.error.code));
    const selectedCommand = this.abilityCommand();
    const selectedPreview = selectedCommand ? this.session.project(selectedCommand) : undefined;
    const confirm = this.el<HTMLButtonElement>('confirm');
    confirm.dataset.label = selectedCommand
      ? `Confirm ${title(selectedCommand.abilityId)} → ${title(selectedCommand.targetId)}${this.ability === 'crosswind' ? ` (${this.direction})` : ''}`
      : 'Confirm ability';
    this.availability(confirm, locked ?? (!this.session.pending || !selectedPreview ? 'Select a legal ability target'
      : selectedPreview.ok ? undefined : selectedPreview.error.code));
    this.el('feedback').textContent = `${this.session.message}${this.session.busy ? ' Resolving action…' : ''}${state.phase === 'victory' || state.phase === 'defeat' ? ' Restart or choose a fresh patrol.' : ''}`;
    this.renderFacts(facts); this.draw(facts);
    this.el('events').replaceChildren(...this.session.events.map(event => {
      const li = document.createElement('li'); li.dataset.event = event.type;
      if ('sourceId' in event) li.dataset.source = event.sourceId;
      li.textContent = this.eventText(event); return li;
    }));
    this.renderPreview();
  }
  private renderFacts(facts: PreviewFacts): void {
    if (!facts.available) return;
    this.el('links').textContent = facts.links.map(link => `${link.from.brood} ↔ ${link.to.brood}: ${link.state} (${link.distance})`).join(' · ');
    this.el('shelters').textContent = `Shelter: ${facts.shelters.map(entry => `${entry.sourceId} → ${entry.targetId} (${entry.eligible ? 'eligible' : 'Close link lost'})`).join('; ') || 'none'}`;
    this.el('intentions').replaceChildren(...facts.threats.map(entry => {
      const li = document.createElement('li'); li.dataset.source = entry.intention.sourceId;
      li.textContent = `${title(entry.intention.sourceId)}: ${entry.intention.kind === 'fixed-area' ? 'fixed cells' : `follows creature ${entry.intention.targetId}`} · ${entry.intention.kind} → ${entry.recipientIds.join(', ') || entry.reason}`;
      li.dataset.cells = JSON.stringify(entry.cells); return li;
    }));
    this.el('protection').textContent = `Protection: ${facts.protections.filter(entry => entry.protected).map(pair).join('; ') || 'none'} · Warder facing ${this.session.state.enemies.find(enemy => enemy.id === 'warder')!.facing}`;
  }
  private eventText(event: GameplayEvent): string {
    if (event.type === 'damage-applied') return `${title(event.targetId)}: HP ${event.hpBefore} → ${event.hpAfter} (${event.damage} damage; protection −${event.directionalReduction}, Shelter −${event.shelterReduction}).`;
    if (event.type === 'attack-settled') return `${title(event.sourceId)} attack resolved.`;
    if (event.type === 'action-applied') return `${title(event.actorId)} used ${title(event.abilityId)} on ${title(event.targetId)}.`;
    return event.type.split('-').join(' ');
  }
  private renderPreview(): void {
    const pending = this.session.pending;
    const lines = ['Preview — hover or focus a target, maneuver or End phase. Confirm an ability to spend its action.'];
    if (pending?.ok) {
      const command = pending.command;
      lines.push(command.kind === 'useAbility' ? `Pending: ${title(command.abilityId)} — ${command.actorId} → ${command.targetId}${'direction' in command ? ` (${command.direction})` : ''}.`
        : command.kind === 'maneuver' ? `Pending: ${MANEUVER_LABELS[command.maneuver]}.` : 'Pending: End phase.');
      const state = pending.state as PatrolSession['state'], projection = pending.projection;
      lines.push(`Immediate: ${hpText(state)} · ${state.phase}.`);
      if (projection.after.available) {
        lines.push(`Destination links: ${projection.after.links.map(link => `${link.from.brood} ↔ ${link.to.brood} ${link.state}`).join('; ')}.`);
        lines.push(`Shelter: ${projection.after.shelters.map(entry => `${entry.sourceId} → ${entry.targetId}: ${entry.eligible ? 'eligible' : 'Close link lost'}`).join('; ') || 'none'}.`);
        lines.push(`Protection gained: ${projection.protectionGained.map(pair).join('; ') || 'none'}; lost: ${projection.protectionLost.map(pair).join('; ') || 'none'}.`);
        lines.push(`Threats: ${projection.after.threats.map(entry => `${entry.intention.sourceId}: ${entry.intention.kind === 'fixed-area' ? 'fixed cells' : 'follows creature'} ${entry.cells.map(cell => `(${cell.q},${cell.r})`).join(',')} → ${entry.recipientIds.join(',') || entry.reason}`).join('; ')}.`);
      }
      const forecast = pending.forecast;
      lines.push(forecast.kind === 'transition' && forecast.ok ? `${forecast.condition}: ${hpText(forecast.state as PatrolSession['state'])} · ${forecast.state.phase}. Remaining player choices are excluded.` : `${forecast.condition}: ${forecast.kind === 'transition' && !forecast.ok ? `unavailable (${forecast.error.code})` : forecast.kind}.`);
    } else if (pending) lines.push(`Unavailable: ${pending.error.code}.`);
    this.el('projection').replaceChildren(...lines.map(line => Object.assign(document.createElement('p'), { textContent: line })));
    this.el('ghosts').replaceChildren(...(pending?.ok && pending.projection.after.available ? pending.projection.after.positions.map(position => {
      const ghost = document.createElement('span'); ghost.className = 'ghost'; ghost.dataset.brood = position.brood;
      ghost.dataset.q = String(position.cell.q); ghost.dataset.r = String(position.cell.r);
      const pixel = projectHex(position.cell, PROJECTION); ghost.style.left = `${pixel.x}px`; ghost.style.top = `${pixel.y}px`; return ghost;
    }) : []));
  }
  private draw(facts: PreviewFacts): void {
    const graphics = this.graphics; graphics.clear(); this.el('board-stage').dataset.cells = String(boardCells().length);
    for (const cell of boardCells()) {
      const pixel = projectHex(cell, PROJECTION), radius = PROJECTION.spacing / Math.sqrt(3);
      const points = Array.from({ length: 6 }, (_, i) => new Phaser.Math.Vector2(pixel.x + Math.cos((30+i*60)*Math.PI/180)*radius, pixel.y + Math.sin((30+i*60)*Math.PI/180)*radius));
      graphics.fillStyle(0x1c2833); graphics.fillPoints(points, true); graphics.lineStyle(1, 0x43515d); graphics.strokePoints(points, true);
    }
    if (!facts.available) return;
    for (const link of facts.links) {
      const a = projectHex(link.from.cell, PROJECTION), b = projectHex(link.to.cell, PROJECTION);
      graphics.lineStyle(3, link.state === 'close' ? 0xb7c8d3 : 0xe2b681);
      const length = Math.hypot(b.x-a.x, b.y-a.y);
      for (let offset = 0; offset < length; offset += link.state === 'close' ? length : 16) {
        const end = Math.min(offset + (link.state === 'close' ? length : 9), length);
        graphics.lineBetween(a.x+(b.x-a.x)*offset/length, a.y+(b.y-a.y)*offset/length, a.x+(b.x-a.x)*end/length, a.y+(b.y-a.y)*end/length);
      }
    }
    for (const enemy of this.session.state.enemies.filter(enemy => enemy.hp > 0)) {
      for (const cell of frontMask(enemy.facing)) {
        const pixel = projectHex(cell, PROJECTION); graphics.fillStyle(0xe88165, .16); graphics.fillCircle(pixel.x, pixel.y, 24);
      }
    }
    for (const threat of facts.threats) for (const cell of threat.cells) {
      const pixel = projectHex(cell, PROJECTION); graphics.lineStyle(3, 0xffa58e); graphics.strokeCircle(pixel.x, pixel.y, 32);
    }
  }
}
