import Phaser from 'phaser'

import ScoreLabel from '../ui/ScoreLabel'
import BombSpawner from "../logic/BombSpawner"
import Enemy from "../objects/Enemy"
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
		this.tower = undefined
		this.myConfig = undefined
		this.currentLvlId = undefined
	}

	preload(){
		this.myConfig = myConfig

		this.load.image(STAR_KEY, 'assets/star.png')
		this.load.image(BOMB_KEY, 'assets/bomb.png')
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

		this.load.image('enemy','assets/Virus1.png',80,80)

	}

	create(){

		let config = this.myConfig
		console.log(config)
		this.currentLvlId = config.lvls.lvl_1.internalLvlName
		// console.log(this.currentLvlId)

		const tileSize = 160
		const mainScale = config.tileScale
		// const mainScale =0.5
		const lvl_1 = this.make.tilemap({ key: 'lvl_1' });
		const lvl_2 = this.make.tilemap({ key: 'lvl_2' });
		const map = lvl_1

		//json
		// const map  = this.make.tilemap({ key: 'map' });
		// const tileset = map.addTilesetImage('pixel_em','tiles',tileSize,tileSize)
		const tileset = map.addTilesetImage('pixel_em','tiles',tileSize,tileSize)

		// from json
		const floorLayer = map.createStaticLayer("floor", tileset,0,0)
		const wallsLayer = map.createDynamicLayer("walls", tileset,0,0)//lol dont produce error
		floorLayer.setScale(mainScale,mainScale)
		if(wallsLayer == undefined) debugger;



		// map.setLayerTileSize(tileSize,tileSize,wallsLayer)
		wallsLayer.setScale(mainScale,mainScale)

		// wallsLayer.setCollisionByProperty({ collides: true }) //doesnt work STILL
		wallsLayer.setCollisionByExclusion([-1])
		// wallsLayer.setCollisionBetween(0, 4); //fson not work to

		const debugGraphics = this.add.graphics().setAlpha(0.75);
			wallsLayer.renderDebug(debugGraphics, {
			tileColor: null, // Color of non-colliding tiles
			collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
			faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
		});

		this.player = this.createPlayer()
		// this.stars = this.createStars()

		this.scoreLabel = this.createScoreLabel(16, 16, 0, this.currentLvlId)
		// this.bombSpawner = new BombSpawner(this, BOMB_KEY)
		// const bombsGroup = this.bombSpawner.group

		// this.physics.add.collider(this.player, platforms)
		// this.physics.add.collider(this.stars, platforms)
		// this.physics.add.collider(bombsGroup, layer)
		// this.physics.add.collider(this.player, bombsGroup)


		// this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)

		this.cursors = this.input.keyboard.createCursorKeys()
		//===================


		this.enemy = this.createEnemy()
		this.physics.add.collider(this.enemy, this.player,this.enemy.setNewRandomDirection.bind(this.enemy),null,this)
		// this.physics.add.collider(this.enemy, platforms)

		this.physics.add.collider(this.player, wallsLayer)
	}

	createTilemap(){
		// csv
		// const map = this.add.tilemap('map',tileSize,tileSize)
		// const tileset = map.addTilesetImage('pixel','tiles',tileSize,tileSize)
		// const layer = map.createDynamicLayer("layer",tileset,0 ,0)//wtf name==layer??
	}

	createEnemy(){
		let enemy = new Enemy(this,100,450,ENEMY_KEY)

		return enemy
	}

	createPlayer(){
		const player = this.physics.add.sprite(100, 450, DUDE_KEY)
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

		// this.enemy.body.touching

	}
}
