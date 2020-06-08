import Bullet from "../../objects/Bullet"

export default class CommonBullet extends Bullet{
	constructor(scene,tower,to) {
		super(scene, tower, to, 'bullet1')
		this.type = "slow"
		this.speed = 80
		this.delay = tower.slowDelay
	}
}