import { createCollector } from './content/collector';
import { createCrucible } from './content/crucible';
import { createPatrol } from './content/patrol';
import Phaser from 'phaser';
import './style.css';
import { FormationLab, createLabShell } from './view/FormationLab';
import { CombatScene, createCombatShell } from './view/CombatScene';

const play = new URLSearchParams(location.search).get('play');
const encounter = play === 'patrol' || play === 'crucible' || play === 'collector' ? play : undefined;
const parent = document.querySelector<HTMLElement>('#app')!;
if (encounter) createCombatShell(parent, encounter); else createLabShell(parent);
new Phaser.Game({
  type: Phaser.CANVAS,
  parent: 'board-canvas',
  width: encounter ? 620 : 760,
  height: encounter ? 500 : 610,
  backgroundColor: '#16212b',
  scene: encounter === 'collector' ? new CombatScene(createCollector, 'collector')
    : encounter === 'crucible' ? new CombatScene(createCrucible, 'crucible')
    : encounter === 'patrol' ? new CombatScene(createPatrol) : FormationLab,
});
