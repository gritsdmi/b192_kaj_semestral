import Phaser from 'phaser'

export default class Enemy extends Phaser.GameObjects.Sprite{
	constructor(scene, x,y,sprite){
		super(scene, x,y,sprite)
		this.directions = [0,1,2,3]
		this.direction = Phaser.Math.RND.pick(this.directions)
		this.health = 100
		this.position = [this.x,this.y]

		scene.physics.world.enable(this);
		scene.add.existing(this)
		this.body.setCollideWorldBounds(true)

		//// IT'S WORKS ////
		///////////////////
			this.body.setSize(this.body.width - 50,this.body.height - 50) // set colliders size not texture
			this.setScale(0.5,0.5)//scales texture and body
		/////////////////////
		// console.log(this)
	}

	setNewRandomDirection(){
		// this.body.setVelocity(Phaser.Math.Between(min, max),Phaser.Math.Between(min, max))

		// console.log(this.body.wasTouching)
		// console.log(this.body.touching)
	}

}