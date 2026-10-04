import Phaser from 'phaser';

export class FormationLab extends Phaser.Scene {
  constructor() {
    super('formation-lab');
  }

  create(): void {
    this.add.text(64, 56, 'TEHOM — Formation Lab', {
      fontFamily: 'sans-serif', fontSize: '36px', color: '#f0eee6',
    });
    this.add.rectangle(480, 320, 832, 320, 0x202c38).setStrokeStyle(2, 0x546879);
    this.add.text(480, 300, 'Formation placeholder', {
      fontFamily: 'sans-serif', fontSize: '28px', color: '#b8cbd9',
    }).setOrigin(0.5);
    this.add.text(480, 350, 'Browser harness ready', {
      fontFamily: 'sans-serif', fontSize: '18px', color: '#899eaf',
    }).setOrigin(0.5);
  }
}
