import Phaser from 'phaser'
import HealthBar from "../ui/HealthBar"

//main enemy class
export default class Enemy extends Phaser.GameObjects.Sprite{
	constructor(scene,pos,healthFactor,sprite) {
		super(scene,pos.x,pos.y,sprite)
		this.scene = scene
		this.health = 100 * healthFactor
		this.actualSpeed = 40
		this.baseSpeed = 40
		this.slowed = false

		scene.physics.world.enable(this);
		scene.add.existing(this)
		this.body.bodyType = "enemy"
		// this.position = this.body.center
		this.hp = new HealthBar(scene, this);

		//// IT'S WORKS ////
		this.body.setSize(this.body.width - 100,this.body.height - 100) // set colliders size not texture
		this.setScale(scene.myConfig.tileScale)//scales texture and body

		////  PATH  ////
		this.pathPoints = this.scene.pathLayerObjects
		this.currentPathPoint = this.pathPoints[0]

	}

	//calcuate next waypoint 
	getNextIdxOfPathPoint(){
		let currentPointIdx = this.pathPoints.indexOf(this.currentPathPoint)
		currentPointIdx++
		currentPointIdx = currentPointIdx % this.pathPoints.length
		return currentPointIdx
	}

	//returns center of object
	getCenterPos(data){
		let x = data.x + data.width/2
		let y = data.y + data.height/2
		return {x:x, y:y}
	}

	//calculate distane between two bullets
	//retun true if distance < than 2 pixel
	rouglyEqualsPos(object1, object2){
		if(Math.abs(object1.x - object2.x) < 2){
			if(Math.abs(object1.y - object2.y) < 2){
				return true
			}
		}
		return false
	}

	//main update function
	//move enemy, update HP bar, 
	//swith speed depend on slow effect get's from bullet
	update(){

		if (this.slowed == true){
			this.actualSpeed = 0.5 * this.baseSpeed
		} else {
			this.actualSpeed = this.baseSpeed
		}

		// this.position = this.body.center
		this.scene.physics.moveToObject(this,this.currentPathPoint,this.actualSpeed)
		if(this.rouglyEqualsPos(this,this.currentPathPoint)){
			this.currentPathPoint = this.pathPoints[this.getNextIdxOfPathPoint()]
		}

		this.hp.update(this)
	}

	//control HP
	//if is low - die
	controlHealth(){
		if(this.health <= 0){
			this.scene.scoreLabel.add(10)
			this.destroyAll()
		}
	}

	//coorect die (with destroy Health Bar)
	destroyAll(){
		this.destroy();
		this.hp.bar.destroy()
	}
	
	//swith slow effect
	endSlowEvent(){
		this.slowed = false
	}

}