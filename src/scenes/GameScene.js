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

//main main class
//gameloop
//main scene
//stores most of variables, physics etc.
export default class GameScene extends Phaser.Scene{
	constructor(){
		super("GameScene")
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
		// this conf file, in future, 
		//will contain all data for fine tunung the Game
		//unfortunately time has passed...
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

		//using Local Storage API for sets choosen lvl, and for name  
		this.loadLvl = localStorage.getItem("lvl")
		if(this.loadLvl == undefined){
			this.loadLvl = 'lvl_2'
		}

		//using Local Storage API for pass user name  
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
		this.map = this.make.tilemap({ key: this.currentLvlId });

		const tileset = this.map.addTilesetImage('1','tiles',tileSize,tileSize)

		// from json
		const floorLayer = this.map.createStaticLayer("floor", tileset,0,0)
		this.wallsLayer = this.map.createDynamicLayer("walls", tileset,0,0)
		floorLayer.setScale(this.mainScale,this.mainScale)
		this.wallsLayer.setScale(this.mainScale,this.mainScale)

		this.scoreLabel = this.createScoreLabel(16, 16, 0, this.currentLvlId)
////////////// PATH_OBJECTS_LAYER ////////////////
		this.pathLayerObjects = this.map.getObjectLayer('path')['objects']
		this.pathLayerObjects = this.createPathPointsForEnemies()

////////// CREATING ENEMIES ////////// 
		this.enemySpawner = new EnemySpawner(this,this.findSpawnPoint());
		this.enemies = this.physics.add.group({classType:Enemy, runChildUpdate:true})


/////////// TOWERS /////////////
		this.towers = this.physics.add.group({classType:Tower, runChildUpdate:true})
		this.towerController = new TowerController(this)
		

/////////// BULLETS /////////////////
		this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true })
		this.physics.add.overlap(this.enemies,this.bullets,this.hit)

////////// END_CASTLE /////////////////
		this.end = this.createEnd()
		this.physics.add.overlap(this.enemies,this.end,this.end.hit)
		this.gameOverText = this.add.text(300,500,"game over! click mouse to go to main menu /n TODO stop all timer events")
		this.gameOverText.setVisible(false)

////////// MANIPUATING BUTTONS  ////////////
		this.buttonsCountainer = this.createContainer()
		this.mainMenuButton = this.createMainMenuButton()
		this.restartButton = this.createRestartButton()

	}

	//creates HTML div for pair of buttons
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

	//creates HTML button to get main menu
	createMainMenuButton(){
		let existed = document.getElementById("mainMenuButton")
		if(existed != undefined){
			existed.style.visibility = "visible"
			existed.style.zIndex = 5
			return existed
		}
		
		let mainMenuButton = document.createElement("div")
		mainMenuButton.setAttribute("class","button")
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

	//creates HTML button to hard reset current level
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

	//creates "Castle" End.js
	createEnd(){
		let end = new End(this,this.findEndPoint())
		return end
	}

	//function invokes when bullet hit enemy
	//destroy bullet and depend on bullet's type cause effect(damage or slow)
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

	//parse map, saved like JSON object
	//find point where will spawn enemies 
	findSpawnPoint(){
		let spawnPoint = this.map.getObjectLayer("path")["objects"]
			.filter(point => point.type == "spawn")
			.filter(point => point.x *= this.mainScale)
			.filter(point => point.y *= this.mainScale)[0]
			
		return{x:spawnPoint.x, y:spawnPoint.y}
	}
	
	//parse map, saved like JSON object
	//find point where will placed "Castle" End,js 
	findEndPoint(){
		let endPoint = this.map.getObjectLayer("path")["objects"]
			.filter(point => point.type == "end")
			.filter(point => point.x *= this.mainScale)
			.filter(point => point.y *= this.mainScale)[0]
			// console.log(endPoint)
		return{x:endPoint.x, y:endPoint.y}
	}

	//prepare path points for enemies
	//points had parsed from map, saved like JSON object
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

	//creates label which display coins 
	createScoreLabel(x, y, score, currentLvl) {
		const style = { fontSize: '32px', fill: '#fff' }
		const label = new ScoreLabel(this, x, y, score, style,currentLvl)

		this.add.existing(label)

		return label
	}

	//correct end the game and return to main menu
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

	//main update loop
	//controls end game
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
	}
}
