import Enemy from "../../objects/Enemy"
import HealthBar from "../../ui/HealthBar"


export default class CommonEnemy extends Enemy {
	constructor(scene,pos,healthFactor) {
        super(scene,pos,healthFactor,'enemy1')
        this.health = this.health * 1.1 * healthFactor
        // console.log(this.health, "heavy")
        this.baseSpeed = this.baseSpeed * 0.7
		this.hp = new HealthBar(scene, this);

    }

    controlHealth(){
        // console.log("heavy control health" , this.health)

		if(this.health <= 0){
			this.scene.scoreLabel.add(20)
			super.destroyAll()
		}
	}

}
