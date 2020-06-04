import Phaser from 'phaser'

import ScoreLabel from '../ui/ScoreLabel'
import BombSpawner from "../logic/BombSpawner"
import Enemy from "../objects/Enemy"
import Tower from "../objects/Tower"
import CommonTower from "../objects/CommonTower"
import Bullet from "../objects/Bullet"
import EnemySpawner from "../logic/EnemySpawner"
import TowerController from "../logic/TowerController"
import myConfig from "../../public/configs/data.json"

const DUDE_KEY = 'dude'
const STAR_KEY = 'star'
const BOMB_KEY = 'bomb'
const ENEMY_KEY = 'enemy'

export default class GameScene extends Phaser.Scene{
	constructor(){
		super("GameScene")
		this.player = undefined
		this.controls = undefined
		this.scoreLabel = undefined
		this.bombSpawner = undefined
		this.stars = undefined
		this.gameOver = false
		this.enemy = undefined
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
	}

	preload(){
		this.myConfig = myConfig

		this.load.image(STAR_KEY, 'assets/star.png')
		/////
		// TODO create function to load all lvls
		this.load.image('tiles', 'assets/PixelArt.png')
		this.load.tilemapTiledJSON('lvl_1', 'assets/Level_1_1.json')
		this.load.tilemapTiledJSON('lvl_2', 'assets/level_2.json')

		// this.load.tilemapCSV('map', 'assets/Level_1.csv')
		// this.load.tilemapCSV('map', 'assets/Level_1_walls.csv')

		this.load.spritesheet(DUDE_KEY, 
			'assets/dude.png',
			{ frameWidth: 32, frameHeight: 48 }
		)

		this.load.image('enemy','assets/virus3.png',80,80)
		this.load.image('tower','assets/tower.png',80,80)
		this.load.image('tower1','assets/tower1.png',80,80)
		this.load.image('bomb', 'assets/bomb.png')


	}



	create(){

		const config = this.myConfig
		// console.log(config)
		this.currentLvlId = config.lvls.lvl_1.internalLvlName

		const tileSize = 160
		this.mainScale = config.tileScale
		// const mainScale =0.5
		const lvl_1 = this.make.tilemap({ key: this.currentLvlId });
		const lvl_2 = this.make.tilemap({ key: 'lvl_2' });
		this.map = lvl_1

		//json
		// const map  = this.make.tilemap({ key: 'map' });
		// const tileset = this.map.addTilesetImage('pixel_em','tiles',tileSize,tileSize)
		const tileset = this.map.addTilesetImage('pixel_em','tiles',tileSize,tileSize)

		// from json
		const floorLayer = this.map.createStaticLayer("floor", tileset,0,0)
		this.wallsLayer = this.map.createDynamicLayer("walls", tileset,0,0)//lol dont produce error
		floorLayer.setScale(this.mainScale,this.mainScale)
		this.wallsLayer.setScale(this.mainScale,this.mainScale)
		// this.map.setLayerTileSize(tileSize,tileSize,wallsLayer)

///////////////// Tiles collisoins rules //////////////////////
		// wallsLayer.setCollisionByProperty({ collides: true }) //doesnt work STILL
		this.wallsLayer.setCollisionByExclusion([-1])
		// wallsLayer.setCollisionBetween(0, 4); //json not work to

////////////// PATH_OBJECTS_LAYER ////////////////
		this.pathLayerObjects = this.map.getObjectLayer('path')['objects']
		// console.log(pathLayerObjects) //points is here!!!!!!!!
		this.pathLayerObjects.info = this.pathLayerObjects.length -1
		this.pathLayerObjects = this.createPathPointsForEnemies()
//////////////////////////////////////////////////////////
		
		// console.log(pathLayer.tileToWorldXY(2,2))
		// containsPoint(x, y)
		// pathLayer.updatePixelXY()

		this.player = this.createPlayer()
		this.scoreLabel = this.createScoreLabel(16, 16, 0, this.currentLvlId)
		this.cursors = this.input.keyboard.createCursorKeys()
		//===================

		// this.physics.add.collider(this.enemy, platforms)

		this.physics.add.collider(this.player, this.wallsLayer)

		const debugGraphics = this.add.graphics().setAlpha(0.75);
			this.wallsLayer.renderDebug(debugGraphics, {
			tileColor: null, // Color of non-colliding tiles
			collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
			faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
		});

////////// CREATING ENEMIES ////////// 

		this.enemySpawner = new EnemySpawner(this,ENEMY_KEY);
		this.enemies = this.physics.add.group({classType:Enemy, runChildUpdate:true})
		this.enemy = this.createEnemy()
		this.physics.add.collider(this.enemy, this.player)


/////////// TOWERS /////////////
		this.towers = this.physics.add.group({classType:Tower, runChildUpdate:true})
		let tower = new Tower(this,120,120,'tower1')
		this.towers.add(tower)
		this.towerController = new TowerController(this)
		let testTower = new CommonTower(this,200,200)


/////////// BULLETS /////////////////
		this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true })
		this.physics.add.overlap(this.enemies,this.bullets,this.enemy.hit)

/////////// MARKER /////////////
		// let markerBlankLayer = this.map.createBlankDynamicLayer('layer1',tileset)
		// markerBlankLayer.setScale(this.mainScale)
		this.marker = this.add.graphics()
		this.marker.lineStyle(5, 0xffffff, 1)
		this.marker.strokeRect(0, 0, this.map.tileWidth * this.wallsLayer.scaleX, this.map.tileHeight * this.wallsLayer.scaleY);

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

	createBullet(autor,aim){
		let bullet = new Bullet(this,autor,aim,'bomb')
		this.bullets.add(bullet)
	}

	createTilemap(){
		// csv
		// const map = this.add.tilemap('map',tileSize,tileSize)
		// const tileset = map.addTilesetImage('pixel','tiles',tileSize,tileSize)
		// const layer = map.createDynamicLayer("layer",tileset,0 ,0)//wtf name==layer??
	}

	createEnemy(){
		let enemy = new Enemy(this,40,450,ENEMY_KEY)
		this.enemies.add(enemy)
		return enemy
	}

	createPlayer(){
		const player = this.physics.add.sprite(100, 350, DUDE_KEY)
		player.setBounce(0.1)
		player.setCollideWorldBounds(true)

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

		return player
	}

	createPlatforms(){
		const platforms = this.physics.add.staticGroup()

		platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody()
	
		platforms.create(600, 400, GROUND_KEY)
		platforms.create(50, 250, GROUND_KEY)
		platforms.create(750, 220, GROUND_KEY)

		return platforms
	}

	createStars(){
		const stars = this.physics.add.group({
			key: STAR_KEY,
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 }
		})
		
		stars.children.iterate((child) => {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
		})

		return stars
	}

	collectStar(player, star){
		star.disableBody(true, true)
		this.scoreLabel.add(10)

		if (this.stars.countActive(true) === 0){
			//  A new batch of stars to collect
			this.stars.children.iterate((child) => {
				child.enableBody(true, child.x, 0, true, true)
			})
		}
		this.bombSpawner.spawn(player.x)
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

	update(){
		if (this.gameOver){
			return
		}

		if (this.cursors.left.isDown){
			this.player.setVelocityX(-160)
			this.player.anims.play('left', true)
		}else if (this.cursors.right.isDown){
			this.player.setVelocityX(160)
			this.player.anims.play('right', true)
		}else{
			this.player.setVelocityX(0)
			this.player.anims.play('turn')
		}

		if (this.cursors.up.isDown
		 // && this.player.body.touching.down
		 ){
			this.player.setVelocityY(-130)
		} else if(this.cursors.down.isDown){
			this.player.setVelocityY(130)
		} else {
			this.player.setVelocityY(0)
		}

		// this.enemy.body.setVelocityY(-40)
		// this.physics.accelerateTo(this.enemy,40,40,10,40)
		// this.physics.moveTo(this.enemy,40,40,40)


////////// BULLETS ////////////////
		// console.log(this.bullets)
		// for (let i = 0; i < this.bullets.length; i++) {
		// 	if(this.bullets[i].update()){}
		// }


//////////MARKER///////////
		var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
		// Rounds down to nearest tile
		var pointerTileX = this.map.worldToTileX(worldPoint.x);
		var pointerTileY = this.map.worldToTileY(worldPoint.y);

		// Snap to tile coordinates, but in world space
		this.marker.x = this.map.tileToWorldX(pointerTileX,this.cameras.main,this.wallsLayer);
		this.marker.y = this.map.tileToWorldY(pointerTileY,this.cameras.main,this.wallsLayer);

		this.towerController.update()
	}
}
