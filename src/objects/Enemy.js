import Phaser from 'phaser'

export default class Enemy extends Phaser.GameObjects.Sprite{
	constructor(scene, x,y,sprite){
		super(scene, x,y,sprite)
		this.directions = [0,1,2,3]
		this.direction = Phaser.Math.RND.pick(this.directions)
		this.health = 100

		scene.physics.world.enable(this);
		scene.add.existing(this)
		this.body.setCollideWorldBounds(true)
		this.position = this.body.center

		//// IT'S WORKS ////
		///////////////////
			this.body.setSize(this.body.width - 50,this.body.height - 50) // set colliders size not texture
			this.setScale(0.5,0.5)//scales texture and body
		/////////////////////

		// console.log(this)

		////  PATH  ////
		this.pathPoints = this.scene.pathLayerObjects
		console.log(this.pathPoints) //points is here!!!!!!!!

		this.speed = 40
		let pointsTest = this.pathPoints
		// console.log(this.getCenterPos(this.currentPathPoint))

		let test = pointsTest.filter(point => point.type == "move")
		test.sort(function(a,b) {
			return a.name - b.name
		})

		//todo move this to gamescene class
		test = test.filter(point => point.x = (point.x + point.width/2)*this.scene.mainScale)
		test = test.filter(point => point.y = (point.y + point.height/2)*this.scene.mainScale)

		console.log(test)
		this.pathPoints = test
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
		return {x,y}
	}

	rouglyEqualsPos(object1, object2){
		if(Math.abs(object1.x - object2.x) < 2){
			if(Math.abs(object1.y - object2.y) < 2){
				console.log("positions are equals")
				return true
			}
		}
		return false
	}

	update(){
		// this.position = this.body.center
		this.scene.physics.moveToObject(this,this.currentPathPoint,this.speed)
		// this.scene.physics.moveTo(this,this.currentPathPoint.getCenterX,this.currentPathPoint.getCenterY,this.speed)
		if(this.rouglyEqualsPos(this,this.currentPathPoint)){
			this.currentPathPoint = this.pathPoints[this.getNextIdxOfPathPoint()]
			console.log("new path is ",this.currentPathPoint )
		}
	}



}