import Tower from "../objects/Tower"

export default class CommonTower extends Tower{
	constructor(scene,x,y){
		super(scene,x,y,'tower')
		this.radius = 100
		this.price = 20
		this.shootDelay = 100;

	}
}