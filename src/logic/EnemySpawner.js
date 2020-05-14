import Phaser from 'phaser'
import Enemy from "../objects/Enemy"

export default class EnemySpawner {

	constructor(scene, enemyKey = 'enemy'){
		this.scene = scene
		this.key = enemyKey
		this.spawnDelay = 2000
		this.startDelay = 1000
		this.startDelay = this.startDelay * (-1)

		// this._group = this.scene.physics.add.group()

		this.scene.time.addEvent({
			delay: this.spawnDelay,
			repeat: 5,
			callback: ()=>{
			    // spawn a bullet
			    this.spawn()
			},
			startAt : this.startDelay
			// loop: true
		})
	}

	spawn(){
		// this.group.create()

		this.scene.enemies.add(new Enemy(this.scene, 40,500,this.key))

	}

}
