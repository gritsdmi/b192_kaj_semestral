import Tower from "../objects/Tower"
import CommonBullet from "../objects/bullets/CommonBullet"

//this class represents tower whitch shoot common bullets
export default class CommonTower extends Tower{
	constructor(scene,x,y){
		super(scene,x,y,'tower')
		this.radius = 200
		this.price = 20
		this.shootDelay = 1000;
		this.damage = 10
		this.y -= 10

		this.scene.time.addEvent({
			delay: this.shootDelay,
			callback: ()=>{
			    // spawn a bullet
			    this.controlCollider(this)
			},
			loop: true
		})
	}

	//create slowBullet
	createBullet(tower,object){
		let bullet = new CommonBullet(this.scene,tower,object)
		this.scene.bullets.add(bullet)
	}
}