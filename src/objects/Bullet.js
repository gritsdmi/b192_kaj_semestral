import Phaser from 'phaser'

export default class Bullet extends Phaser.GameObjects.Sprite{
	constructor(scene,tower,to,image){
		super(scene,tower.x,tower.y-30,image)
		scene.physics.world.enable(this);
		scene.add.existing(this)
		this.body.bodyType = "bullet"
		this.damage = tower.damage
		this.to = to
		this.dest = this.to.center
		this.speed = 100

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
		this.scene.physics.moveTo(this,this.dest.x,this.dest.y,this.speed)

		if(Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds()) == false){
			this.active = false;
			this.destroy()
			return true
		}

		if(this.rouglyEqualsPos(this, this.dest)){
			this.destroy()
			return true
		}
	}
}