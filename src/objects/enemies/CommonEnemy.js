import Enemy from "../../objects/Enemy"

export default class CommonEnemy extends Enemy {
	constructor(scene,pos,healthFactor) {
		super(scene,pos,healthFactor,'enemy')
	}

}
