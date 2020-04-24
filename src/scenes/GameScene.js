import Phaser from 'phaser'

import ScoreLabel from '../ui/ScoreLabel'
import BombSpawner from "../logic/BombSpawner"
import Enemy from "../objects/Enemy"

const GROUND_KEY = 'ground'
const DUDE_KEY = 'dude'
const STAR_KEY = 'star'
const BOMB_KEY = 'bomb'

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

	}

	preload(){
		this.load.image('sky', 'assets/sky.png')
		this.load.image(GROUND_KEY, 'assets/platform.png')
		this.load.image(STAR_KEY, 'assets/star.png')
		this.load.image(BOMB_KEY, 'assets/bomb.png')
		/////
		this.load.image('tiles', 'assets/PixelArt.png')
		this.load.tilemapTiledJSON('map', 'assets/Level_1.json')

		// this.load.tilemapCSV('map', 'assets/Level_1.csv')
		// this.load.tilemapCSV('map', 'assets/Level_1_walls.csv')

		this.load.spritesheet(DUDE_KEY, 
			'assets/dude.png',
			{ frameWidth: 32, frameHeight: 48 }
		)
	}

	create(){
		const tileSize = 160
		const mainScale = 0.5

		// csv
		// const map = this.add.tilemap('map',tileSize,tileSize)
		// const tileset = map.addTilesetImage('pixel','tiles',tileSize,tileSize)
		// const layer = map.createDynamicLayer("layer",tileset,0 ,0)//wtf name==layer??


		//json
		const map  = this.make.tilemap({ key: 'map' });
		const tileset = map.addTilesetImage('pixel_em','tiles',tileSize,tileSize)

		// from json
		const floorLayer = map.createStaticLayer("floor", tileset,0,0)
		const layer = map.createDynamicLayer("walls", tileset,0,0)//lol dont produce error
		floorLayer.setScale(mainScale,mainScale)
		if(layer == undefined) debugger;



		// map.setLayerTileSize(tileSize,tileSize,layer)
		layer.setScale(mainScale,mainScale)

		// layer.setCollisionByProperty({ collides: true }) //doesnt work STILL
		layer.setCollisionByExclusion([-1])
		// layer.setCollisionBetween(0, 4); //fson not work to

		const debugGraphics = this.add.graphics().setAlpha(0.75);
			layer.renderDebug(debugGraphics, {
			tileColor: null, // Color of non-colliding tiles
			collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
			faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
		});
		// console.log(map)


		// this.add.image(400, 300, 'sky')
		const platforms = this.createPlatforms()
		this.player = this.createPlayer()
		this.stars = this.createStars()

		this.scoreLabel = this.createScoreLabel(16, 16, 0)
		this.bombSpawner = new BombSpawner(this, BOMB_KEY)
		// const bombsGroup = this.bombSpawner.group

		this.physics.add.collider(this.player, platforms)
		this.physics.add.collider(this.stars, platforms)
		// this.physics.add.collider(bombsGroup, platforms)
		// this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this)


		this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)

		this.cursors = this.input.keyboard.createCursorKeys()
		//===================
		this.enemy = this.createEnemy()
		this.physics.add.collider(this.enemy, this.player,this.enemy.setNewRandomDirection.bind(this.enemy),null,this)
		this.physics.add.collider(this.enemy, platforms)

		this.physics.add.collider(this.player, layer)
	}

	createTilemap(){

	}

	createEnemy(){
		// console.log(this)
		let enemy = new Enemy(this,50,450,BOMB_KEY)
		// console.log(enemy)
		// enemy.setBounce(0.1)
		// enemy.body.setCollideWorldBounds(true)
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

	createScoreLabel(x, y, score) {
		const style = { fontSize: '32px', fill: '#000' }
		const label = new ScoreLabel(this, x, y, score, style)

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