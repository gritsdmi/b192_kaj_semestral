//script - starter my game
//has config object and function-starter
import Phaser from 'phaser'
import GameScene from './scenes/GameScene'

const config = {
	type: Phaser.AUTO,
	width: 1360,
	height: 880,
	// 1600×900
	physics: {
		default: 'arcade',
		arcade: {
			debug : false,
		}
	},
	scale: {
        // mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH
    },
	scene: [GameScene]
}

export function startGame(){
	const game = new Phaser.Game(config);
}


// "Tower Defence

// Naimplementuji klasickou hry zanru tower defence
// Docasny nazev: Corona Defence.
// Hra bude vuzivat framework/engine phazer (verze 3)
// Planuji realizovat dalsi funkcionality:
// MUST HAVE:
// 1) levelovani: (2 - 3 ruzne mapy) ulozene ve formatu JSON
// 2) ruzne typy nepratelu se budou lisit poctem HP a ryclosti pohybu
// NICE TO HAVE:
// "

