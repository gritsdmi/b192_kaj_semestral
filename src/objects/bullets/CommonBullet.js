import Bullet from "../../objects/Bullet"

//normal common bullet
//do damage
export default class CommonBullet extends Bullet{
	constructor(scene,tower,to) {
		super(scene, tower, to ,'bullet')
		this.type = "common"
		this.damage = tower.damage
	}
}