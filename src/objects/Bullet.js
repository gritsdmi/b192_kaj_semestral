import Phaser from 'phaser'

export default class Bullet extends Phaser.GameObjects.Sprite{
	constructor(scene,tower,to,image){
		super(scene,tower.x,tower.y,image)
		scene.physics.world.enable(this);
		scene.add.existing(this)
		this.body.bodyType = "bullet"
		// console.log(to)
		this.damage = tower.damage
		this.to = to
		this.dest = this.to.center
		// this.scene.physics.moveToObject(this,to.center,100)
		// console.log(this)

	}

	update(){
		// if(this.body.onWorldBounds() == false){
		// 	console.log("bul to del")
		// }
		// console.log(this.dest)
		this.scene.physics.moveTo(this,this.dest.x,this.dest.y,100)

		if(Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds()) == false){
			// console.log("bullet destroj")
			this.active = false;
			// console.log('bullet destrojed')
			return true
		}
	}
}