import Phaser from 'phaser'

//class tower represents tower object
//this class will be extended by SlowTower and CommonTower
export default class Tower extends Phaser.GameObjects.Sprite{
	constructor(scene,x,y,image){
		super(scene,x,y,image)
		this.type = undefined
		this.radius = 150
		scene.physics.world.enable(this);
		scene.add.existing(this)
		this.body.bodyType = "tower"
		this.damage = 0
		this.setScale(scene.myConfig.tileScale)//scales texture and body
		this.active = true
		this.placable = true
		this.price = 0

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


	//"search" the viruses and shot to them
	controlCollider(tower){
		let collidedObj = this.scene.physics.overlapCirc(this.x,this.y,this.radius,true,false)
		if(tower.active == true){
			for (let i = 0; i < collidedObj.length; i++ ){
				if(collidedObj[i].bodyType == "enemy"){
					this.createBullet(tower,collidedObj[i])
					break
				}
			}
		}
	}

	//do nothing
	createBullet(){}

	//return price
	getPrice(){
		return this.price
	}
}