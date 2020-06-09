import Tower from "../objects/Tower"
import SlowBullet from "../objects/bullets/SlowBullet"

//this class represents tower whitch shoot slow bullets
export default class SlowTower extends Tower{
	constructor(scene,x,y){
		super(scene,x,y,'tower1')
		this.radius = 200
		this.price = 30
		this.shootDelay = 1000;
		this.damage = 0
		this.slowDelay = 5000

		this.scene.time.addEvent({
			delay: this.shootDelay,
			callback: ()=>{
			    // spawn a bullet
			    this.controlCollider(this)
			},
			timeScale: 0.5,
			loop: true
		})
	}

	//create slowBullet
	createBullet(tower,object){
		let bullet = new SlowBullet(this.scene,tower,object)
		this.scene.bullets.add(bullet)
	}

	//call super's method
	controlCollider(tower){
		super.controlCollider(tower)
	}
}