import Phaser from 'phaser'

export default class Enemy extends Phaser.GameObjects.Sprite{
	constructor(scene, x,y,sprite){
		super(scene, x,y,sprite)
		this.health = 30

		scene.physics.world.enable(this);
		scene.add.existing(this)
		this.body.bodyType = "enemy"
		this.body.setCollideWorldBounds(true)
		this.position = this.body.center

		//// IT'S WORKS ////
		///////////////////
		this.body.setSize(this.body.width - 50,this.body.height - 50) // set colliders size not texture
		this.setScale(scene.myConfig.tileScale)//scales texture and body
		/////////////////////

		// console.log(this)

		////  PATH  ////
		this.pathPoints = this.scene.pathLayerObjects
		// console.log(this.pathPoints) //points is here!!!!!!!!

		this.speed = 40
		// let pointsTest = this.pathPoints
		// // console.log(this.getCenterPos(this.currentPathPoint))

		// let test = pointsTest.filter(point => point.type == "move")
		// test.sort(function(a,b) {
		// 	return a.name - b.name
		// })

		// //todo move this to gamescene class
		// test = test.filter(point => point.x = (point.x + point.width/2)*this.scene.mainScale)
		// test = test.filter(point => point.y = (point.y + point.height/2)*this.scene.mainScale)

		// this.pathPoints = test
		this.currentPathPoint = this.pathPoints[0]


		// console.log(this)
		// console.log(this.pathPoints)
		// console.log(this.scene.mainScale)
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
		return {x,y}
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
		if(this.active == false) return

		this.position = this.body.center
		this.scene.physics.moveToObject(this,this.currentPathPoint,this.speed)
		// this.scene.physics.moveTo(this,this.currentPathPoint.getCenterX,this.currentPathPoint.getCenterY,this.speed)
		if(this.rouglyEqualsPos(this,this.currentPathPoint)){
			this.currentPathPoint = this.pathPoints[this.getNextIdxOfPathPoint()]
			// console.log("new path is ",this.currentPathPoint )
		}
	}
	
	hit(enemy,bullet){
		if(bullet == undefined) return
		enemy.health = enemy.health - bullet.damage;
		bullet.destroy()
		if(enemy.health <= 0){
			enemy.destroy();
		}
	}

}