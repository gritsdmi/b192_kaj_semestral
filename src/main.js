import Phaser from 'phaser'

import GameScene from './scenes/GameScene'

const config = {
	type: Phaser.AUTO,
	width: 1600,
	height: 900,
	// 1600×900
	physics: {
		default: 'arcade',
		arcade: {
			debug : true,
			// gravity: { y: 200 }
		}
	},
	scale: {
        // mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH
    },
	scene: [GameScene]
}

export default new Phaser.Game(config)
