import Bullet from "../../objects/Bullet"

//slow bullet
//has another slowly speed than common
//hasn't any damage (only slows enemy)
export default class SlowBullet extends Bullet{
	constructor(scene,tower,to) {
		super(scene, tower, to, 'bullet1')
		this.type = "slow"
		this.speed = 80
		this.delay = tower.slowDelay
	}
}