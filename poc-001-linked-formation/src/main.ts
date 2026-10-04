import Phaser from 'phaser';
import './style.css';
import { FormationLab, createLabShell } from './view/FormationLab';

createLabShell(document.querySelector<HTMLElement>('#app')!);
new Phaser.Game({
  type: Phaser.CANVAS,
  parent: 'board-canvas',
  width: 760,
  height: 610,
  backgroundColor: '#16212b',
  scene: FormationLab,
});
