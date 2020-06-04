import Tower from "../objects/Tower"
import Phaser from 'phaser'

export default class TowerController extends Phaser.GameObjects.GameObject{
	constructor(scene){
		super(scene,"towerController")
		this.scene = scene
		scene.add.existing(this)

		//tower image pos x:100 y:900
		this.towers = []
		this.actualSelect = ""
		this.sprites = this.createUITowers()
	}

	createUITowers(){
		//нажал на картинку
		//подсветил места, на которые возможно поставить башню!!!!
		//потом нажал на стену 
		//после клика на поле проверил: walls layer has tile on XY, another towers

		//2 типа башенок: tower.png i tower1.png
		var tower1 = this.scene.add.sprite(120, 760, 'tower').setInteractive({ cursor: 'pointer' });
		var tower2 = this.scene.add.sprite(200, 760, 'tower1').setInteractive({ cursor: 'pointer' });

		tower1.setScale(this.scene.myConfig.tileScale)//scales texture and body
		tower2.setScale(this.scene.myConfig.tileScale)//scales texture and body
		this.towers.push(tower1)
		this.towers.push(tower2)


		tower1.on('pointerover', function (event) {
		    this.setTint(0x555555);
		});

		tower1.on('pointerout', function (event) {
		    this.clearTint();
		});

		tower1.on('pointerdown', function (event) {
			this.clicked = true
	        // this.clearTint();
	        this.actualSelect = "tower"
			console.log("clicked", this.clicked, this.actualSelect)
		},this);

		tower2.on('pointerover', function (event) {
		    this.setTint(0x555555);
		});

		tower2.on('pointerout', function (event) {
		    this.clearTint();
		});

		tower2.on('pointerdown', function (event) {
			this.clicked = true
	        this.actualSelect = "tower1"
			console.log("clicked", this.clicked, this.actualSelect)
		},this);


		this.cursor = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);

		let first_click_hook = false
		let sceneTowers = this.scene.towers
		this.scene.input.on('pointerdown', (pointer) => {
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
							// console.log("obsazeno")
						}
					} else {
						// console.log("miss click")
					}
					first_click_hook = false
					this.clicked = false
				}
			} else {
				// console.log("not the time")
				first_click_hook = false
			}

		},this);

		return [tower1,tower2]
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
			let tower = new Tower(this.scene,pos.x,pos.y,this.actualSelect)
			this.scene.towers.add(tower)
		}
	}

	update(){
		if(this.scene.scoreLabel.getScore() < 20){
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
