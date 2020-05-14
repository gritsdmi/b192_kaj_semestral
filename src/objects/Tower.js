import Phaser from 'phaser'


export default class Tower extends Phaser.GameObjects.Sprite{
	constructor(scene,x,y,image){
		super(scene,x,y,image)
		this.type = undefined
		this.radius = 150
		scene.physics.world.enable(this);
		scene.add.existing(this)
		this.body.bodyType = "tower"
		this.damage = 10

		let test = this.scene.add.graphics();
		test.fillCircle(x,y,this.radius)
		
		this.controlColliderDelay = 500;
		this.shootDelay = 1000;
		this.scene.time.addEvent({
			delay: this.shootDelay,
			callback: ()=>{
			    // spawn a bullet
			    this.controlCollider(this)
			},
			loop: true
		})
	}

	update(){
		// console.log("upd")
		// if(this.scene.enemy.)
	}

	controlCollider(tower){
		// console.log(this.scene.physics.overlapCirc(this.x,this.y,100,true,false))
		let collidedObj = this.scene.physics.overlapCirc(this.x,this.y,this.radius,true,false)

		for (let i = 0; i < collidedObj.length; i++ ){
			if(collidedObj[i].bodyType == "enemy"){
				// console.log("see enemy")
				tower.scene.createBullet(tower,collidedObj[i])
				break
			}
		}
	}
}