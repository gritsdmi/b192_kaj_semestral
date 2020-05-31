import Tower from "../objects/Tower"
import Phaser from 'phaser'

export default class TowerController extends Phaser.GameObjects.GameObject{
	constructor(scene){
		super(scene,"towerController")
		this.scene = scene
		scene.add.existing(this)
		this.offset = 40


		//tower image pos x:100 y:900
		this.towers = []
		this.clicked = undefined
		this.sprites = this.createUITowers()
	}

	createUITowers(){

		var tower1 = this.scene.add.sprite(120, 760, 'tower').setInteractive({ cursor: 'pointer' });
		var tower2 = this.scene.add.sprite(200, 760, 'tower').setInteractive({ cursor: 'pointer' });
		var tower3 = new Tower(this.scene,120,200,'tower').setInteractive({ cursor: 'pointer' });
		tower1.setScale(this.scene.myConfig.tileScale)//scales texture and body
		tower2.setScale(this.scene.myConfig.tileScale)//scales texture and body
		tower3.active = false;
		this.scene.towers.add(tower3)

		this.setDrag(tower1)
		this.setDrag(tower2)
		this.setDrag(tower3)

		tower1.on('pointerover', function (event) {
		    this.setTint(0x555555);
		});

		tower1.on('pointerout', function (event) {
		    this.clearTint();
		});

		tower1.on('pointerdown', function (event) {
			this.clicked = true
	        this.clearTint();
			console.log("clicked", this.clicked)
		});

		tower2.on('pointerover', function (event) {
		    this.setTint(0x555555);
		});

		tower2.on('pointerout', function (event) {
		    this.clearTint();
		});

		tower2.on('pointerdown', function (event) {
			this.clicked = true
			console.log("clicked", this.clicked)
		});



		this.cursor = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);
		//place image of tower somewhere
		//control cursor cliking on this image

		//after click ligth places where u can build tower
		//create tower, ONLY if cursor placed over wall and there are not another tovers
		return [tower1,tower2]
	}

	placeTower(tower){
		// this.scene.input.setDraggable(tower,false);
		tower.removeInteractive()
		tower.active = true
	}

	possiblePlaceTower(pointer, tower){
		let ret = false


	}

	resetTowerPos(tower){
		console.log("reset tower pos")
		tower.resetPosition()
		console.log(tower)
	}

	setDrag(tower){
		this.scene.input.setDraggable(tower);
		this.scene.input.dragDistanceThreshold = 1;

		this.scene.input.on('dragstart', function (pointer, gameObject) {
       		gameObject.setTint(0x999999);
		    });

	    this.scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
	        // Rounds down to nearest tile
			var pointerTileX = this.scene.map.worldToTileX(pointer.x);
			var pointerTileY = this.scene.map.worldToTileY(pointer.y);

			// Snap to tile coordinates, but in world space
			gameObject.x = this.scene.map.tileToWorldX(pointerTileX,this.scene.cameras.main,this.scene.wallsLayer);
			gameObject.y = this.scene.map.tileToWorldY(pointerTileY,this.scene.cameras.main,this.scene.wallsLayer);
			gameObject.x += 40
			gameObject.y += 40
	    });

	    this.scene.input.on('dragend', function (pointer, gameObject) {
	        gameObject.clearTint();
	        // gameObject.possiblePlaceTower(pointer,gameObject)
	        if(this.scene.map.hasTileAtWorldXY(pointer.x, pointer.y)) {
				let tileUnderPointer = this.scene.map.getTileAtWorldXY(pointer.x,pointer.y,this.scene.wallsLayer)
				if(tileUnderPointer.layer.name == "walls"){
					if(gameObject.placable == true){
						console.log("can place here",gameObject)
						this.placeTower(gameObject)
					} else {
						this.resetTowerPos(gameObject)
						gameObject.resetPlacable(true)
						console.log("tower no placable")
					}
				} else {
					console.log("miss2 incorrect layer")
				}
				// this.placeTower()
			} else {
				console.log("miss1 has no tile at pos")
				this.resetTowerPos(gameObject)

			}
	    },this);
	}

	overlapAnotherTower(me,another){
		// console.log("towers overlaps")
		console.log(me,another)
		// if(me.active = false){
		// 	me.placable = false
		// 	console.log("me placable false")
		// }
		if(another.active == false){
			another.placable = false;
			console.log("another placable false")

		}
	}

	update(){
		//почему this.clicked is undefined?

		// console.log(this.scene.map.hasTileAtWorldXY(this.cursor.x,this.cursor.y), this.clicked)
		// debugger

		// if(this.clicked == true && this.scene.map.hasTileAtWorldXY(cursor.x,cursor.y)){
		// 	//iterate all towers, getBounds().contains(x and y from cursor) 
		// 	console.log("iterating")
		// 	for (let i = 0; i < this.towers.lenght(); i++){
		// 		if(this.towers[i].getBounds().contains()){
		// 		}
		// 	}
		// }
	}


}
