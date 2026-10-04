import Phaser from 'phaser';
import { FormationLab } from './view/FormationLab';
import './style.css';

new Phaser.Game({
  type: Phaser.CANVAS,
  parent: 'app',
  width: 960,
  height: 600,
  backgroundColor: '#121820',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: FormationLab,
});
