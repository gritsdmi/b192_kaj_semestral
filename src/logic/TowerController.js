import Tower from "../objects/Tower"
import CommonTower from "../objects/CommonTower"
import SlowTower from "../objects/SlowTower"
import Phaser from 'phaser'

export default class TowerController extends Phaser.GameObjects.GameObject{
	constructor(scene){
		super(scene,"towerController")
		this.scene = scene
		scene.add.existing(this)

		this.towers = []
		this.actualSelect = ""
		this.sprites = this.createUITowers()
		this.scene.scoreLabel.add(500)
	}

	makeTextPrice(tower){
		let price = "Price ".concat(tower.getData("price"))
		let text = this.scene.add.text(tower.x-35, tower.y + 50, price)
		return text
	}

	createUITowers(){

		var tower1 = this.scene.add.sprite(120, 760, 'tower').setInteractive({ cursor: 'pointer' });
		var tower2 = this.scene.add.sprite(200, 760, 'tower1').setInteractive({ cursor: 'pointer' });

		tower1.setScale(this.scene.myConfig.tileScale)//scales texture and body
		tower2.setScale(this.scene.myConfig.tileScale)//scales texture and body
		tower1.setData({price:"20"})
		tower2.setData({price:"30"})
		let textPrice1 = this.makeTextPrice(tower1)
		let textPrice2 = this.makeTextPrice(tower2)
		this.towers.push(tower1)
		this.towers.push(tower2)


		tower1.on('pointerover', function (event) {
		    this.setScale(0.6)
		});

		tower1.on('pointerout', function (event) {
		    this.setScale(this.scene.myConfig.tileScale)
		});

		tower1.on('pointerdown', function (event) {
			this.setScale(0.45)
		});

		tower1.on('pointerup', function (event) {
			this.resetScale(this.towers[0])
			this.clicked = true
	        this.actualSelect = "tower"
			console.log("clicked", this.clicked, this.actualSelect)
		},this);

		tower2.on('pointerover', function (event) {
			this.setScale(0.6)
		});

		tower2.on('pointerout', function (event) {
		    this.setScale(this.scene.myConfig.tileScale)
		});

		tower2.on('pointerdown', function (event) {
			this.setScale(0.45)
		});

		tower2.on('pointerup', function (event) {
			this.resetScale(this.towers[1])
			this.clicked = true
	        this.actualSelect = "tower1"
			console.log("clicked", this.clicked, this.actualSelect)
		},this);

		let first_click_hook = false
		let sceneTowers = this.scene.towers
		this.scene.input.on('pointerup', (pointer) => {
			if(this.clicked == true){
				if(first_click_hook == false){
					first_click_hook = true
				} else {
					if(this.scene.map.hasTileAtWorldXY(pointer.x, pointer.y)){
						let cursorOnTower = false
						sceneTowers.children.each(function (t){
							if(t.getBounds().contains(pointer.x,pointer.y) == true){
								cursorOnTower = cursorOnTower | true
							}
						})
						if(cursorOnTower == false){
							this.placeTower(pointer)
						} else {
							console.log("obsazeno")
						}
					} else {
						console.log("miss click")
					}
					first_click_hook = false
					this.clicked = false
				}
			} else {
				console.log("not the time")
				first_click_hook = false
			}
		},this);

		return [tower1,tower2]
	}

	resetScale(obj){
		obj.setScale(this.scene.myConfig.tileScale)
	}

	getTileCoords(pointer){
		let retX = 40
		let retY = 40
		var pointerTileX = this.scene.map.worldToTileX(pointer.x)
		var pointerTileY = this.scene.map.worldToTileY(pointer.y)

		retX += this.scene.map.tileToWorldX(pointerTileX,this.scene.cameras.main,this.scene.wallsLayer)
		retY += this.scene.map.tileToWorldY(pointerTileY,this.scene.cameras.main,this.scene.wallsLayer)
		return {x:retX, y:retY}
	}

	placeTower(pointer){
		let pos = this.getTileCoords(pointer)
		if(this.actualSelect != ""){
			let tower = undefined
			if(this.actualSelect == 'tower'){
				tower = new CommonTower(this.scene,pos.x,pos.y)
			} else if(this.actualSelect == 'tower1'){
				tower = new SlowTower(this.scene,pos.x,pos.y)
			}
			this.scene.towers.add(tower)
			this.scene.scoreLabel.sub(tower.getPrice())
		}

	}

	update(){
		if(this.scene.scoreLabel.getScore() < this.towers[0].getData("price")){
			this.towers[0].setTint(0x333333)
			this.towers[0].disableInteractive()
		} else {
			this.towers[0].clearTint()
			this.towers[0].setInteractive({ cursor: 'pointer' })
		}

		if(this.scene.scoreLabel.getScore() < 40){
			this.towers[1].setTint(0x333333)
			this.towers[1].disableInteractive()
		} else {
			this.towers[1].clearTint()
			this.towers[1].setInteractive({ cursor: 'pointer' })
		} 
	}
}
