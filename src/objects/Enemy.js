import Phaser from 'phaser'
import HealthBar from "../ui/HealthBar"


export default class Enemy extends Phaser.GameObjects.Sprite{
	constructor(scene,pos,healthFactor,sprite) {
		super(scene,pos.x,pos.y,sprite)
		this.scene = scene
		this.health = 100 * healthFactor
		this.actualSpeed = 40
		this.sloved_speed = 20
		this.baseSpeed = 40
		this.slowed = false

		scene.physics.world.enable(this);
		scene.add.existing(this)
		this.body.bodyType = "enemy"
		this.body.setCollideWorldBounds(true)
		this.position = this.body.center
		this.hp = new HealthBar(scene, this);

		//// IT'S WORKS ////
		this.setScale(scene.myConfig.tileScale)//scales texture and body
		this.body.setSize(this.body.width - 70,this.body.height - 70) // set colliders size not texture

		////  PATH  ////
		this.pathPoints = this.scene.pathLayerObjects
		this.currentPathPoint = this.pathPoints[0]

	}

	getNextIdxOfPathPoint(){
		let currentPointIdx = this.pathPoints.indexOf(this.currentPathPoint)
		currentPointIdx++
		currentPointIdx = currentPointIdx % this.pathPoints.length
		return currentPointIdx
	}

	getCenterPos(data){
		let x = data.x + data.width/2
		let y = data.y + data.height/2
		return {x:x, y:y}
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

		if (this.slowed == true){
			this.actualSpeed = 0.5 * this.baseSpeed
		} else {
			this.actualSpeed = this.baseSpeed
		}


		this.position = this.body.center
		this.scene.physics.moveToObject(this,this.currentPathPoint,this.actualSpeed)
		// this.scene.physics.moveTo(this,this.currentPathPoint.getCenterX,this.currentPathPoint.getCenterY,this.actualSpeed)
		if(this.rouglyEqualsPos(this,this.currentPathPoint)){
			this.currentPathPoint = this.pathPoints[this.getNextIdxOfPathPoint()]
			// console.log("new path is ",this.currentPathPoint )
		}

		this.hp.update(this)
	}

	controlHealth(){
		if(this.health <= 0){
			this.scene.scoreLabel.add(10)
			this.destroyAll()
		}
	}

	destroyAll(){
		this.destroy();
		this.hp.bar.destroy()
	}
	
	endSlowEvent(){
		// console.log("endslow")
		this.slowed = false
	}

}