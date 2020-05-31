import Phaser from 'phaser'

export default class Bullet extends Phaser.GameObjects.Sprite{
	constructor(scene,tower,to,image){
		super(scene,tower.x,tower.y-30,image)
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
	rouglyEqualsPos(object1, object2){
		if(Math.abs(object1.x - object2.x) < 2){
			if(Math.abs(object1.y - object2.y) < 2){
				return true
			}
		}
		return false
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
			this.destroy()
			// console.log('bullet destrojed')
			return true
		}

		if(this.rouglyEqualsPos(this, this.dest)){
			this.destroy()
			return true
		}
	}
}