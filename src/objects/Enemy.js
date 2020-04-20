import Phaser from 'phaser'

export default class Enemy extends Phaser.GameObjects.Sprite{
	constructor(scene, x,y,sprite){
		super(scene, x,y,sprite)
		this.directions = [0,1,2,3]

		// this.scene = scene
		this.setRandomPosition(0, 0, 600, 600);
		this.health = 100

		this.position = [this.x,this.y]
		this.direction = Phaser.Math.RND.pick(this.directions)
		// console.log(this.direction)


		scene.physics.world.enable(this);
		scene.add.existing(this)
	    // this.body.setGravityY(0);
		// this.body.setBounce(1)
		this.body.setCollideWorldBounds(true)
		// this.debugShowVelocity(true)
		this.body.setVelocity(100,125)


		// console.log(this.position)
	}

	setNewRandomDirection(){
		// while(true){
		// 	let newDir = Phaser.Math.RND.pick(this.directions)
		// 	if(newDir!=this.direction){
		// 		console.log("new dir set")
		// 		this.direction = newDir
		// 		return 
		// 	}
		// }
		let min = -200
		let max = 200
		console.log("here")
		// console.log(this)
		this.body.setVelocity(Phaser.Math.Between(min, max),Phaser.Math.Between(min, max))
	}


}