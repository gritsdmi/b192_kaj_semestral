import Phaser from 'phaser'

export default class Enemy extends Phaser.GameObjects.Sprite{
	constructor(scene, x,y,sprite){
		super(scene, x,y,sprite)
		this.directions = [0,1,2,3]
		this.direction = Phaser.Math.RND.pick(this.directions)

		this.health = 100

		// this.setPosition(x,y)
		this.position = [this.x,this.y]
		// console.log(this.direction)
		// console.log(this.position)

		// this.width = 42
		// this.height = 42
		// this.scale = 3;

		scene.physics.world.enable(this);
		scene.add.existing(this)
		this.body.setCollideWorldBounds(true)
		this.body.setSize(50,50)//padding

		// this.body.setVelocity(100,125)

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
		// console.log("here")
		// console.log(this)
		// this.body.setVelocity(Phaser.Math.Between(min, max),Phaser.Math.Between(min, max))
		console.log(this.body.touching)
		// console.log(this.body.wasTouching)


	}


}