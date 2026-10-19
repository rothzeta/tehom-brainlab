import Phaser from 'phaser';
import rawContent from '../../../content/combat-content.v1.json';
import { createFight, loadContent } from '../../core';
import type { ActionId, BattleSession, BroodId, Command, FightOptions, PartTarget, Preview, Target } from '../../core/types';
import { cuesFor } from '../../audio';
import type { AudioPlayer } from '../../audio';
import { battleBackground, broodPortrait, EMBLEM_CREDITS, EMBLEM_SOURCES, enemyArt, enemyPanel, partAppearance } from '../art';
import type { DrawDescription } from '../art';
import { createSession } from '../session';
import { battleModel } from './model';

export interface BattleMountOptions extends FightOptions {
  game: Phaser.Game;
  audio: AudioPlayer;
  onExit: () => void;
}
const json = (value: unknown) => JSON.stringify(value);
const same = (a: unknown, b: unknown) => json(a) === json(b);

/** DOM controls preserve native focus/keyboard semantics over the Phaser arena.
 * The whole surface scales together from 1280×720, including art hit regions. */
export function mountBattle(root: HTMLElement, supplied: BattleSession | null, options: BattleMountOptions): () => void {
  const content = supplied?.content ?? loadContent(rawContent);
  const session = supplied ?? createSession(content, createFight(content, { encounterId: options.encounterId, party: options.party, start: options.start }));
  const frame = document.createElement('div');
  frame.dataset.screen = 'battle';
  frame.dataset.encounter = options.encounterId;
  frame.dataset.party = options.party.join(',');
  frame.dataset.start = options.start;
  frame.style.cssText = 'position:relative;width:100%;max-width:1280px;aspect-ratio:16/9';
  const surface = document.createElement('div');
  surface.className = 'battle-surface';
  surface.style.cssText = 'position:absolute;inset:0;width:1280px;height:720px;transform-origin:top left;pointer-events:none';
  const style = document.createElement('style');
  style.textContent = `
    .battle-surface {font:14px/1.35 system-ui;color:#edf3f7;overflow-wrap:anywhere}
    .battle-surface section,.battle-surface header {position:absolute;box-sizing:border-box;background:#15222ef2;border:1px solid #718294;border-radius:8px;padding:8px;overflow:auto;pointer-events:auto}
    .battle-surface h2 {font-size:15px;margin:0 0 6px;color:#edd493}
    .battle-surface button {box-sizing:border-box;max-width:calc(100% - 4px);font:inherit;color:inherit;background:#2a4054;border:1px solid #7890a4;border-radius:4px;padding:5px 8px;margin:2px;cursor:pointer}
    .battle-surface button[aria-pressed=true] {background:#65532c;border:2px solid #ffdd88}
    .battle-surface button:disabled {opacity:.55;cursor:default}
    .battle-surface button:focus-visible {outline:3px solid #80e6ff;outline-offset:1px}
    .battle-surface pre {white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.4 monospace;margin:4px 0}
    .battle-surface .part-row {display:block;width:99%;text-align:left}
    .battle-surface .intent {border-bottom:1px solid #57697a;padding:4px 0;font-size:12px}
    .battle-surface .cancelled,.battle-surface .revoked {text-decoration:line-through}
    .battle-surface .hit {position:absolute;background:transparent!important;border:0!important;margin:0!important;padding:0!important;border-radius:0;pointer-events:auto}
    .battle-surface .hit[aria-pressed=true] {outline:4px solid #ffdd88;outline-offset:0}
    .battle-surface a {color:#9cddff}
  `;
  root.append(style, frame);
  // Q01 owns the shell. Reparent its existing canvas rather than create a game.
  const stage = options.game.canvas?.parentElement ?? document.getElementById('combat-canvas');
  const stageParent = stage?.parentElement;
  const stageNext = stage?.nextSibling;
  if (stage) { frame.append(stage); stage.style.position = 'absolute'; stage.style.inset = '0'; }
  frame.append(surface);
  const resize = () => { surface.style.transform = `scale(${frame.clientWidth / 1280})`; if (options.game.scene.isBooted) options.game.scale.refresh(); };
  const observer = new ResizeObserver(resize); observer.observe(frame); resize();

  let actor: BroodId = session.state.party[0]!.id;
  let category = 'Attack';
  let action: ActionId | null = null;
  let target: Target = null;
  let selectedPart: PartTarget | null = null;
  let pending: Command | null = null;
  let preview: Preview | null = null;
  let error = '';
  let lastEvents: readonly import('../../core/types').Event[] = [];
  const log: string[] = [];
  let scene: Phaser.Scene | null = null;
  let disposed = false;
  const sceneKey = 'component-battle';

  function section(label: string, x: number, y: number, width: number, height: number) {
    const node = document.createElement('section');
    node.setAttribute('aria-label', label);
    node.style.cssText = `left:${x}px;top:${y}px;width:${width}px;height:${height}px`;
    const heading = document.createElement('h2'); heading.textContent = label; node.append(heading);
    surface.append(node); return node;
  }
  function text(parent: HTMLElement, value: string, tag = 'div') {
    const node = document.createElement(tag); node.textContent = value; parent.append(node); return node;
  }
  function button(parent: HTMLElement, label: string, id: string, callback: () => void, selected = false) {
    const node = document.createElement('button'); node.type = 'button'; node.textContent = label;
    node.dataset.control = id; node.setAttribute('aria-pressed', String(selected));
    node.onclick = callback; parent.append(node); return node;
  }
  const partLabel = (t: PartTarget) => `${t.enemy} / ${content.enemies.find(e => e.id === session.state.enemies.find(e => e.id === t.enemy)?.definitionId)?.parts.find(p => p.id === t.part)?.name ?? t.part}`;
  function candidates(): { target: Target; label: string }[] {
    const state = session.state;
    const definition = content.actions.find(a => a.id === action);
    switch (definition?.target) {
      case 'part': case 'component': return state.enemies.flatMap(e => e.parts.map(p => ({ target: { enemy: e.id, part: p.id }, label: partLabel({ enemy: e.id, part: p.id }) })));
      case 'poisoned-enemy': return state.enemies.map(e => ({ target: { enemy: e.id }, label: e.id }));
      case 'intent': return state.intents.map(i => ({ target: { intent: i.id }, label: `${i.kind} / ${i.sourcePart} / ${i.id}` }));
      case 'brood': return state.party.map(b => ({ target: { brood: b.id }, label: b.id }));
      default: return [{ target: null, label: 'Self / no target' }];
    }
  }
  function actCommand(value: Target): Command {
    return { kind: 'act', expectedRevision: session.state.revision, actor, action: action!, target: value };
  }
  function reason(value: Target, result: Preview): string {
    if (result.result.ok) return '';
    const notes: string[] = [result.result.error.code];
    // Descriptive state annotations only. The core alone decides legality.
    const selectedActor = session.state.party.find(b => b.id === actor);
    if (selectedActor?.hp === 0) notes.push('actor dead');
    if (selectedActor?.statuses.pinned) notes.push('actor Pinned');
    if (value && 'intent' in value) {
      const intent = session.state.intents.find(i => i.id === value.intent);
      const source = session.state.enemies.find(e => e.id === intent?.enemy)?.parts.find(p => p.id === intent?.sourcePart);
      if (source?.kind === 'body') notes.push('source is not a component');
      if (intent && intent.status !== 'pending') notes.push(`${intent.status}: ${intent.cancellationReason ?? intent.status}`);
    }
    if (value && 'enemy' in value && !('part' in value)) {
      const enemy = session.state.enemies.find(e => e.id === value.enemy);
      if (enemy?.poison === 0) notes.push('no poison');
      if (enemy?.parts.find(p => p.kind === 'body')?.pool === 0) notes.push('enemy dead');
    }
    if (value && 'part' in value) {
      const enemy = session.state.enemies.find(e => e.id === value.enemy);
      const part = enemy?.parts.find(p => p.id === value.part);
      if (enemy?.parts.find(p => p.kind === 'body')?.pool === 0) notes.push('enemy dead');
      if (part?.pool === 0) notes.push('destroyed');
      if (part?.shieldedBy && enemy?.parts.some(p => p.id === part.shieldedBy && p.pool > 0)) notes.push(`shielded by ${part.shieldedBy}`);
      if (content.actions.find(a => a.id === action)?.target === 'component' && part?.kind !== 'component') notes.push('not a component');
    }
    if (value && 'brood' in value) {
      const brood = session.state.party.find(b => b.id === value.brood);
      if (brood?.hp === 0) notes.push('dead');
      if (brood?.statuses.pinned) notes.push('Pinned');
      if (action === 'salve' && brood?.hp === brood?.maxHp) notes.push('full HP');
    }
    return notes.join(' · ');
  }
  function chooseAction(id: ActionId) {
    action = id; error = '';
    const choices = candidates();
    target = choices.find(t => selectedPart && same(t.target, selectedPart) && session.preview(actCommand(t.target)).result.ok)?.target
      ?? choices.find(t => session.preview(actCommand(t.target)).result.ok)?.target ?? choices[0]?.target ?? null;
    if (target && 'part' in target) selectedPart = target as PartTarget;
    pending = actCommand(target); render();
  }
  function choosePart(value: PartTarget) {
    selectedPart = value;
    if (action && candidates().some(c => same(c.target, value))) {
      target = value; pending = actCommand(value);
    }
    render();
  }
  function confirm() {
    if (!pending) return;
    const command = structuredClone(pending);
    const result = session.commit(command);
    if (!result.ok) { error = result.error.code; render(); }
    else { pending = null; action = null; preview = null; error = ''; render(); }
  }
  function draw(description: DrawDescription, x = 0, y = 0) {
    if (!scene) return;
    const b = description.bounds;
    const shape = description.kind === 'ellipse'
      ? scene.add.ellipse(x + b.x + b.width / 2, y + b.y + b.height / 2, b.width, b.height, description.color)
      : scene.add.rectangle(x + b.x + b.width / 2, y + b.y + b.height / 2, b.width, b.height, description.color);
    shape.setAlpha(description.alpha ?? 1);
    if (description.outline) shape.setStrokeStyle(description.outline.width, description.outline.color);
    if (description.crossedOut) {
      const g = scene.add.graphics().lineStyle(3, 0xffcccc);
      g.lineBetween(x + b.x, y + b.y, x + b.x + b.width, y + b.y + b.height);
      g.lineBetween(x + b.x + b.width, y + b.y, x + b.x, y + b.y + b.height);
    }
    if (description.label) scene.add.text(x + b.x + b.width / 2, y + b.y + b.height / 2, description.label, {
      fontSize: '14px', color: '#ffffff', backgroundColor: '#15222e', align: 'center', wordWrap: { width: Math.max(b.width, 80) },
    }).setOrigin(.5);
  }
  function drawArena() {
    if (!scene) return;
    scene.children.removeAll(true);
    for (const layer of battleBackground()) draw(layer);
    session.state.enemies.forEach((enemy, index) => {
      const x = 278 + index * 260, y = 50;
      scene!.add.text(x + 8, y, content.enemies.find(e => e.id === enemy.definitionId)!.name, { fontSize: '15px', color: '#edd493', wordWrap: { width: enemyPanel(enemy.definitionId).width - 16 } });
      for (const art of Object.values(enemyArt(enemy.definitionId))) {
        const part = enemy.parts.find(p => p.id === art.partId)!;
        const visual = part.pool === 0 ? 'destroyed' : part.shieldedBy && enemy.parts.some(p => p.id === part.shieldedBy && p.pool > 0) ? 'shielded' : 'intact';
        draw(partAppearance(art, visual), x, y);
        const hit = art.hitRegion;
        const value = { enemy: enemy.id, part: art.partId };
        const node = button(surface, '', `art-${enemy.id}-${part.id}`, () => choosePart(value), same(selectedPart, value));
        node.className = 'hit'; node.dataset.artPart = `${enemy.id}/${part.id}`;
        node.setAttribute('aria-label', `Inspect ${partLabel(value)} on illustration`);
        node.style.cssText = `left:${x + hit.x}px;top:${y + hit.y}px;width:${hit.width}px;height:${hit.height}px`;
      }
    });
  }
  function render() {
    if (disposed) return;
    const focus = (document.activeElement as HTMLElement | null)?.dataset.control;
    const scroll = Array.from(surface.querySelectorAll('section')).map(n => [n.getAttribute('aria-label'), n.scrollTop] as const);
    surface.replaceChildren();
    const state = session.state;
    preview = pending ? session.preview(pending) : null;
    const enemyPhase = preview ? (pending?.kind === 'endPhase' ? preview.result : preview.forecast)
      : state.phase === 'player' ? session.preview({ kind: 'endPhase', expectedRevision: state.revision }).result : null;
    const model = battleModel(state, enemyPhase?.events ?? [], preview);
    frame.dataset.phase = model.phase; frame.dataset.revision = String(model.revision);
    // Data on the rendered preview/log is also available for copying diagnostics.
    const header = section('Component combat', 8, 4, 1264, 42);
    header.style.display = 'flex'; header.style.alignItems = 'center'; header.style.gap = '12px';
    text(header, `Round ${model.round} · ${model.phase} · Revision ${model.revision} · Salves ${model.salveUses}`);
    button(header, options.audio.muted ? 'Unmute' : 'Mute', 'mute', () => { options.audio.setMuted(!options.audio.muted); render(); });
    button(header, 'Exit', 'exit', options.onExit);
    button(header, 'Credits', 'credits', () => { const d = document.createElement('dialog'); text(d, EMBLEM_CREDITS.text); for (const [label, href] of [['Artist', EMBLEM_CREDITS.artistUrl], ['Source', EMBLEM_CREDITS.sourceUrl], ['License', EMBLEM_CREDITS.licenseUrl], ['Full credits', EMBLEM_CREDITS.creditsUrl]]) { const a = document.createElement('a'); a.href = href!; a.textContent = `${label} `; d.append(a); } button(d, 'Close', 'close-credits', () => d.close()); d.onclose = () => d.remove(); frame.append(d); d.showModal(); });
    const party = section('Brood / actor', 8, 50, 258, 350);
    for (const b of model.brood) {
      const node = button(party, `${b.id} · HP ${b.hp}/${b.maxHp} · R ${b.revelation}/${b.revelationCap} · ${b.acted ? 'acted' : 'ready'}`, `actor-${b.id}`, () => { actor = b.id; action = null; pending = null; render(); }, actor === b.id);
      const portrait = broodPortrait(b.id);
      if (portrait.kind === 'emblem') { const image = document.createElement('img'); image.src = EMBLEM_SOURCES[portrait.key]; image.alt = portrait.label; image.width = 38; image.height = 38; image.style.cssText = 'float:left;margin-left:-42px'; node.prepend(image); }
      else { const badge = document.createElement('span'); badge.textContent = portrait.label; badge.style.cssText = `float:left;margin-left:-42px;width:38px;height:38px;display:grid;place-items:center;border:1px solid #bde4ff;border-radius:50%;background:#${portrait.color.toString(16)};color:#15222e;font-size:10px`; node.prepend(badge); }
      node.dataset.actor = b.id; node.dataset.hp = String(b.hp); node.dataset.acted = String(b.acted); node.style.cssText = 'display:block;width:100%;min-height:42px;padding-left:46px;text-align:left';
      text(party, Object.entries(b.statuses).filter(([, value]) => value).map(([kind, value]) => `${kind} ${json(value)}`).join(' · ') || 'No statuses');
      if (b.transformation) text(party, `Form ${json(b.transformation)}`);
    }
    const parts = section('Components', 802, 50, 470, 228);
    for (const enemy of model.enemies) {
      text(parts, `${enemy.id} · Poison ${enemy.poison} · Weakened ${json(enemy.weakened)} · Ward ${json(enemy.wards)}`);
      for (const p of enemy.parts) {
        const value = { enemy: enemy.id, part: p.id };
        const node = button(parts, `${p.id}: ${p.pool}/${p.maxPool} · armor ${p.armor} · ${p.living ? 'living' : 'nonliving'}${p.shieldedBy ? ` · shieldedBy ${p.shieldedBy}` : ''}`, `list-${enemy.id}-${p.id}`, () => choosePart(value), same(selectedPart, value));
        node.className = 'part-row'; node.dataset.listPart = `${enemy.id}/${p.id}`;
      }
    }
    const intents = section('Declared intents / enemy forecast', 802, 284, 470, 240);
    for (const intent of model.intents) {
      const row = document.createElement('div'); row.className = `intent ${intent.status}`; row.dataset.intent = intent.id;
      text(row, `${intent.enemy} / ${intent.sourcePart} → ${intent.kind} → ${json(intent.target)} · ${intent.damageType} · base ${intent.amount} · Ward ${intent.ward}`);
      text(row, `Modifiers ${json(intent.modifiers)} · riders ${json(intent.riders)}`);
      text(row, `${intent.status}${intent.cancellationReason ? `: ${intent.cancellationReason}` : ''} · forecast ${json(intent.hits)} · resolution ${json(intent.resolution)}`);
      intents.append(row);
    }
    const menu = section('Commands', 8, 406, 258, 306);
    for (const label of ['Attack', 'Skills', 'Guard', 'Item']) button(menu, label, `menu-${label}`, () => {
      category = label;
      const kit = content.brood.find(b => b.id === actor)!.actions;
      if (label === 'Attack') chooseAction(kit[0]!);
      else if (label === 'Guard') chooseAction('guard');
      else if (label === 'Item') chooseAction('salve');
      else { action = null; pending = null; render(); }
    }, category === label);
    if (category === 'Skills') for (const id of content.brood.find(b => b.id === actor)!.actions.slice(1).filter(id => id !== 'guard' && id !== 'salve')) button(menu, content.actions.find(a => a.id === id)!.name, `action-${id}`, () => chooseAction(id), action === id).dataset.action = id;
    if (action) text(menu, content.actions.find(a => a.id === action)!.name, 'pre');
    button(menu, 'End Phase', 'end-phase', () => { pending = { kind: 'endPhase', expectedRevision: state.revision }; action = null; error = ''; render(); });
    button(menu, 'Back (Esc)', 'back', () => { pending = null; action = null; error = ''; render(); });
    const confirmButton = button(menu, 'Confirm', 'confirm', confirm); confirmButton.disabled = !preview?.result.ok;
    const message = text(menu, error, 'p'); message.setAttribute('role', 'alert');
    const targets = section('Target selection', 274, 568, 520, 144);
    if (action) for (const item of candidates()) {
      const check = session.preview(actCommand(item.target));
      const why = reason(item.target, check);
      const node = button(targets, `${item.label}${why ? ` — ${why}` : ''}`, `target-${json(item.target)}`, () => { target = item.target; if (target && 'part' in target) selectedPart = target; pending = actCommand(target); render(); }, same(target, item.target));
      node.dataset.target = json(item.target); node.disabled = !check.result.ok; node.title = why;
    }
    const previewPanel = section('Preview / deltas / following enemy phase', 274, 438, 520, 124);
    previewPanel.dataset.previewEvents = json(preview?.events ?? []);
    previewPanel.dataset.command = json(pending);
    if (preview) { text(previewPanel, preview.result.ok ? 'Ready to Confirm' : `Rejected: ${preview.result.error.code}`); text(previewPanel, `Deltas ${json(model.preview?.deltas)}`, 'pre'); text(previewPanel, `Events ${json(preview.events)}`, 'pre'); text(previewPanel, `Enemy phase and end of round ${json(enemyPhase)}`, 'pre'); }
    else text(previewPanel, 'Choose an actor, menu action and target. Inspect any diagram part or list entry. Tab / arrows move focus; Enter activates; Escape goes Back.');
    const events = section('Event log', 802, 530, 470, 182);
    events.dataset.committedEvents = json(lastEvents);
    text(events, log.join('\n') || 'No commands committed.', 'pre');
    drawArena();
    for (const [label, top] of scroll) surface.querySelector(`section[aria-label="${label}"]`)?.scrollTo(0, top);
    if (focus) Array.from(surface.querySelectorAll<HTMLButtonElement>('button')).find(n => n.dataset.control === focus)?.focus({ preventScroll: true });
  }
  function keyboard(event: KeyboardEvent) {
    if ((event.target as HTMLElement).closest('dialog')) return;
    if (event.key === 'Escape') { event.preventDefault(); pending = null; action = null; error = ''; render(); return; }
    if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) {
      const controls = Array.from(surface.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
      const index = controls.indexOf(document.activeElement as HTMLButtonElement);
      const step = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
      controls[(index + step + controls.length) % controls.length]?.focus(); event.preventDefault();
    }
    // Native Enter/Space activates precisely the focused button; hover is inert.
  }
  frame.addEventListener('keydown', keyboard);
  const unsubscribe = session.subscribe((_state, events) => {
    lastEvents = events;
    if (events.length) { log.push(...events.map(json)); options.audio.play(cuesFor(events)); }
    render();
  });
  function startScene() {
    if (disposed) return;
    for (const old of options.game.scene.getScenes(true)) options.game.scene.stop(old.scene.key);
    options.game.scene.add(sceneKey, {
      preload(this: Phaser.Scene) { for (const [key, url] of Object.entries(EMBLEM_SOURCES)) if (!this.textures.exists(key)) this.load.svg(key, url); },
      create(this: Phaser.Scene) { scene = this; render(); },
    }, true);
  }
  if (options.game.scene.isBooted) startScene();
  else options.game.events.once(Phaser.Core.Events.READY, startScene);
  return () => {
    disposed = true; unsubscribe(); observer.disconnect(); frame.removeEventListener('keydown', keyboard);
    options.game.events.off(Phaser.Core.Events.READY, startScene);
    if (options.game.scene.keys[sceneKey]) options.game.scene.remove(sceneKey);
    if (stage && stageParent) { stage.style.position = ''; stage.style.inset = ''; stageParent.insertBefore(stage, stageNext ?? null); }
    frame.remove(); style.remove();
  };
}
