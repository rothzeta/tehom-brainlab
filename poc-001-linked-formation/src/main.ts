import Phaser from 'phaser';
import './style.css';
import { FormationLab, createLabShell } from './view/FormationLab';
import { CombatScene, createCombatShell } from './view/CombatScene';

const patrol = new URLSearchParams(location.search).get('play') === 'patrol';
(patrol ? createCombatShell : createLabShell)(document.querySelector<HTMLElement>('#app')!);
new Phaser.Game({
  type: Phaser.CANVAS,
  parent: 'board-canvas',
  width: patrol ? 620 : 760,
  height: patrol ? 500 : 610,
  backgroundColor: '#16212b',
  scene: patrol ? CombatScene : FormationLab,
});
