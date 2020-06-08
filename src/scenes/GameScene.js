import Phaser from 'phaser'
import { startGame } from "../main"


import myConfig from "../../public/configs/data.json"
import ScoreLabel from '../ui/ScoreLabel'
import Enemy from "../objects/Enemy"
import Tower from "../objects/Tower"
import Bullet from "../objects/Bullet"
import EnemySpawner from "../logic/EnemySpawner"
import TowerController from "../logic/TowerController"
import End from "../objects/End"

const DUDE_KEY = 'dude'

export default class GameScene extends Phaser.Scene{
	constructor(){
		super("GameScene")
		this.player = undefined
		this.controls = undefined
		this.scoreLabel = undefined
		this.bombSpawner = undefined
		this.stars = undefined
		this.gameOver = false
		this.enemies = undefined
		this.towers = undefined
		this.myConfig = undefined
		this.currentLvlId = undefined
		this.pathPoints = undefined
		this.pathLayerObjects = undefined
		this.mainScale = undefined
		this.map = undefined
		this.marker = undefined
		this.bullets = undefined
		this.enemySpawner = undefined
		this.towerController = undefined
		this.wallsLayer = undefined
		this.end = undefined
		this.loadLvl = undefined

		this.gameOverText = undefined
		this.playerName = undefined
		this.mainMenuButton = undefined
		this.restartButton = undefined

		this.buttonsCountainer = undefined
		
	}

	preload(){
		this.myConfig = myConfig

		// TODO create function to load all lvls
		this.load.image('tiles', 'assets/1.png')
		this.load.tilemapTiledJSON('lvl_1', 'assets/Level_1_1.json')
		this.load.tilemapTiledJSON('lvl_2', 'assets/level_2.json')

		this.load.image('enemy','assets/virus3.png',80,80)
		this.load.image('enemy1','assets/virus3_1.png',80,80)
		this.load.image('tower','assets/tower.png',80,80)
		this.load.image('tower1','assets/tower1.png',80,80)
		this.load.image('bullet','assets/bullet.png')
		this.load.image('bullet1','assets/bullet1.png')
		this.load.image('end','assets/base.png',80,80)

		this.loadLvl = localStorage.getItem("lvl")
		if(this.loadLvl == undefined){
			this.loadLvl = 'lvl_2'
		}

		this.playerName = localStorage.getItem("name")
		if(this.playerName == undefined){
			this.playerName = "Guest"
		}

	}


	create(){

		const config = this.myConfig
		this.currentLvlId = this.loadLvl

		const tileSize = 160
		this.mainScale = config.tileScale
		// const loadedMap 
		// const lvl_2 = this.make.tilemap({ key: 'lvl_2' });
		this.map = this.make.tilemap({ key: this.currentLvlId });

		//json
		// const map  = this.make.tilemap({ key: 'map' });
		// const tileset = this.map.addTilesetImage('pixel_em','tiles',tileSize,tileSize)
		const tileset = this.map.addTilesetImage('1','tiles',tileSize,tileSize)

		// from json
		const floorLayer = this.map.createStaticLayer("floor", tileset,0,0)
		this.wallsLayer = this.map.createDynamicLayer("walls", tileset,0,0)//lol dont produce error
		floorLayer.setScale(this.mainScale,this.mainScale)
		this.wallsLayer.setScale(this.mainScale,this.mainScale)

///////////////// Tiles collisoins rules //////////////////////
		// wallsLayer.setCollisionByProperty({ collides: true }) //doesnt work STILL
		// this.wallsLayer.setCollisionByExclusion([-1])
		// wallsLayer.setCollisionBetween(0, 4); //json not work to

////////////// PATH_OBJECTS_LAYER ////////////////
		this.pathLayerObjects = this.map.getObjectLayer('path')['objects']
		// console.log(pathLayerObjects) //points is here!!!!!!!!
		this.pathLayerObjects = this.createPathPointsForEnemies()
//////////////////////////////////////////////////////////
		
		this.player = this.createPlayer()
		this.scoreLabel = this.createScoreLabel(16, 16, 0, this.currentLvlId)
		this.cursors = this.input.keyboard.createCursorKeys()
		//===================

		// this.physics.add.collider(this.player, this.wallsLayer)

		// const debugGraphics = this.add.graphics().setAlpha(0.75);
		// 	this.wallsLayer.renderDebug(debugGraphics, {
		// 	tileColor: null, // Color of non-colliding tiles
		// 	collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
		// 	faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
		// });

////////// CREATING ENEMIES ////////// 

		this.enemySpawner = new EnemySpawner(this,this.findSpawnPoint());
		this.enemies = this.physics.add.group({classType:Enemy, runChildUpdate:true})


/////////// TOWERS /////////////
		this.towers = this.physics.add.group({classType:Tower, runChildUpdate:true})
		this.towerController = new TowerController(this)
		

/////////// BULLETS /////////////////
		this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true })
		this.physics.add.overlap(this.enemies,this.bullets,this.hit)

/////////// MARKER /////////////
		// let markerBlankLayer = this.map.createBlankDynamicLayer('layer1',tileset)
		// markerBlankLayer.setScale(this.mainScale)
		// this.marker = this.add.graphics()
		// this.marker.lineStyle(5, 0xffffff, 1)
		// this.marker.strokeRect(0, 0, this.map.tileWidth * this.wallsLayer.scaleX, this.map.tileHeight * this.wallsLayer.scaleY);
////////// END /////////////////
		this.end = this.createEnd()
		this.physics.add.overlap(this.enemies,this.end,this.end.hit)
		this.gameOverText = this.add.text(300,500,"game over! click mouse to go to main menu /n TODO stop all timer events")
		this.gameOverText.setVisible(false)

		this.buttonsCountainer = this.createContainer()
		this.mainMenuButton = this.createMainMenuButton()
		this.restartButton = this.createRestartButton()

	}

	createContainer(){
		let existed = document.getElementById("#buttonsContainer")
		if(existed != undefined){
			existed.style.visibility = "visible"
			existed.style.zIndex = 5
			return existed
		}
		let container = document.createElement("div")
		container.setAttribute("id","buttonsContainer")
		const referenceNode = document.querySelector('body');
		referenceNode.appendChild(container)
		container.style.zIndex = 5

		return container
		
	}

	createMainMenuButton(){
		let existed = document.getElementById("mainMenuButton")
		if(existed != undefined){
			existed.style.visibility = "visible"
			existed.style.zIndex = 5
			return existed
		}
		
		let mainMenuButton = document.createElement("div")
		mainMenuButton.setAttribute("class","button")
		// mainMenuButton.classList.add("canvas_button_hook")
		mainMenuButton.setAttribute("id","mainMenuButton")
		mainMenuButton.appendChild(document.createElement('p'))
		mainMenuButton.style.zIndex = 5
		const referenceNode = document.querySelector('#buttonsContainer');
		referenceNode.appendChild(mainMenuButton)

		mainMenuButton.onclick = () => {
			console.log("menu button click")
			this.closeTheGame()
		}

		return mainMenuButton
	}

	createRestartButton(){
		let existed = document.getElementById("restartButton")
		if(existed != undefined){
			existed.style.visibility = "visible"
			existed.style.zIndex = 5
			return existed
		}

		let restartButton = document.createElement("div")
		restartButton.setAttribute("class","button")
		restartButton.setAttribute("id", "restartButton")
		restartButton.appendChild(document.createElement('p'))
		restartButton.style.zIndex = 5

		const referenceNode = document.querySelector('#buttonsContainer');
		referenceNode.appendChild(restartButton)

		restartButton.onclick = () => {
			console.log("restart button click")
			document.getElementsByTagName("canvas")[0].classList.remove("blur")
			this.physics.pause(false)
			this.gameOver = false
			this.gameOverText.setVisible(false)
			this.scene.restart();
			document.getElementById("overlay").classList.add("display_none")
			document.getElementById("gameOverImg").classList.add("display_none")
		}

		return restartButton

	}


	createEnd(){
		let end = new End(this,this.findEndPoint())
		//error here
		console.log(end.hp)
		return end
	}

	hit(enemy,bullet){
		if(bullet == undefined) return

		if(bullet.type =="slow" && enemy.slowed == false) {
			enemy.slowed = true

			let slowEvent = enemy.scene.time.addEvent({
				startAt: (-1) * bullet.delay,
				callback: ()=>{
			    	enemy.endSlowEvent()
				}
			})

		} else if(bullet.type == "common"){
			enemy.health = enemy.health - bullet.damage;
			enemy.hp.decrease(bullet.damage)
			enemy.controlHealth()
		}
		bullet.destroy()
	}

	findSpawnPoint(){
		let spawnPoint = this.map.getObjectLayer("path")["objects"]
			.filter(point => point.type == "spawn")
			.filter(point => point.x *= this.mainScale)
			.filter(point => point.y *= this.mainScale)[0]
			
		return{x:spawnPoint.x, y:spawnPoint.y}
	}

	findEndPoint(){
		let endPoint = this.map.getObjectLayer("path")["objects"]
			.filter(point => point.type == "end")
			.filter(point => point.x *= this.mainScale)
			.filter(point => point.y *= this.mainScale)[0]
			// console.log(endPoint)
		return{x:endPoint.x, y:endPoint.y}
	}

	createPathPointsForEnemies(){
		let movePoints = this.pathLayerObjects
		
		movePoints = movePoints.filter(point => point.type == "move")
		movePoints.sort(function(a,b) {
			return a.name - b.name
		})
		movePoints = movePoints.filter(point => point.x = (point.x + point.width/2)*this.mainScale)
		movePoints = movePoints.filter(point => point.y = (point.y + point.height/2)*this.mainScale)

		return movePoints
	}

	createTilemap(){
		// csv
		// const map = this.add.tilemap('map',tileSize,tileSize)
		// const tileset = map.addTilesetImage('pixel','tiles',tileSize,tileSize)
		// const layer = map.createDynamicLayer("layer",tileset,0 ,0)//wtf name==layer??
	}

	createEnemy(){
	}

	createPlayer(){
		// const player = this.physics.add.sprite(100, 350, DUDE_KEY)
		// player.setBounce(0.1)
		// player.setCollideWorldBounds(true)

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		})
		
		this.anims.create({
			key: 'turn',
			frames: [ { key: DUDE_KEY, frame: 4 } ],
			frameRate: 20
		})
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		})

		// return player
	}


	createScoreLabel(x, y, score, currentLvl) {
		const style = { fontSize: '32px', fill: '#fff' }
		const label = new ScoreLabel(this, x, y, score, style,currentLvl)

		this.add.existing(label)

		return label
	}

	hitBomb(player, bomb){
		this.physics.pause()
		player.setTint(0xff0000)
		player.anims.play('turn')
		this.gameOver = true
	}

	closeTheGame(){
		let frame = document.getElementsByClassName('gameframe')[0]
		document.getElementsByTagName("canvas")[0].classList.remove("blur")
		document.getElementById("overlay").classList.add("display_none")
		document.getElementById("gameOverImg").classList.add("display_none")

		localStorage.setItem("result",this.scoreLabel.getScore())
		this.mainMenuButton.style.visibility = "hidden"
		this.restartButton.style.visibility = "hidden"
		
		frame.style.visibility = "visible"
		this.sys.game.destroy(true)
	}

	update(){
		if (this.gameOver == true){
			document.getElementsByTagName('canvas')[0].setAttribute("class","blur")
			document.getElementById('overlay').classList.remove("display_none")
			document.getElementById('gameOverImg').classList.remove("display_none")


			this.physics.pause()
			this.gameOverText.setVisible(true)

			this.input.on('pointerdown', function(){
				this.closeTheGame()
			},this)

			return
		}

		if (this.cursors.left.isDown){
			// this.player.setVelocityX(-160)
			// this.player.anims.play('left', true)
		}else if (this.cursors.right.isDown){
			// this.player.setVelocityX(160)
			// this.player.anims.play('right', true)
		}else{
			// this.player.setVelocityX(0)
			// this.player.anims.play('turn')
		}

		if (this.cursors.up.isDown
		 // && this.player.body.touching.down
		 ){
			// this.player.setVelocityY(-130)
		} else if(this.cursors.down.isDown){
			// this.player.setVelocityY(130)
		} else {
			// this.player.setVelocityY(0)
		}


//////////MARKER///////////
		// var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
		// // Rounds down to nearest tile
		// var pointerTileX = this.map.worldToTileX(worldPoint.x);
		// var pointerTileY = this.map.worldToTileY(worldPoint.y);

		// // Snap to tile coordinates, but in world space
		// this.marker.x = this.map.tileToWorldX(pointerTileX,this.cameras.main,this.wallsLayer);
		// this.marker.y = this.map.tileToWorldY(pointerTileY,this.cameras.main,this.wallsLayer);

		// this.towerController.update()
		// this.end.update()

		// console.log(localStorage.getItem('lvl'))
	}
}
