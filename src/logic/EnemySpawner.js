import Phaser from 'phaser'
import CommonEnemy from "../objects/enemies/CommonEnemy"
import HeavyEnemy from "../objects/enemies/HeavyEnemy"

export default class EnemySpawner {

	constructor(scene,pos,enemyKey = 'enemy'){
		this.scene = scene
		this.key = enemyKey
		this.spawnDelay = 2000
		this.startDelay = 10000
		this.startDelay = this.startDelay * (-1)
		this.pos = pos
		this.defaultEnemiesCount = 10
		this.currentWave = 0
		this.countOfWaves = 10
		this.waveInProgress = false
		this.textInfo = this.scene.add.text(pos.x+100, pos.y,this.currentWave)
		this.textInfo.setText("Wave" + (this.currentWave + 1))
			
		this.wavesTimer =  this.scene.time.addEvent({
			delay: 6 * 1000,
			repeat: this.countOfWaves-1,
			args:[],
			callback: ()=>{
			    // spawn a wave
			    this.spawnWave()
			},
			// startAt : this.startDelay * (-1)
		})
	}

	spawnWave(){
		this.textInfo.setText("Wave" + (this.currentWave + 1))
		let enemyCount = Math.floor(++this.currentWave * this.defaultEnemiesCount * 0.5)
		let healhFactor = this.currentWave * 0.6

		this.scene.time.addEvent({
			delay: this.spawnDelay - 1000,
			repeat: 1,
			args:[],
			callback: ()=>{
			    // spawn a enemy
			    this.spawn(healhFactor)
			},
			// startAt : this.startDelay
		})
	}

	spawn(healhFactor){
		const random = Math.random() < 0.6;
		if(random == true){
			this.scene.enemies.add(new CommonEnemy(this.scene, this.pos,healhFactor))
		} else {
			this.scene.enemies.add(new HeavyEnemy(this.scene, this.pos,healhFactor))
		}
	}

	controlEndWave() {
		if(Math.round(this.wavesTimer.getElapsedSeconds()) >= 40){
			return true
		}

		//todo control alives enemy
	}
}
