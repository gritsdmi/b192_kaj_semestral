import Phaser from 'phaser'


export default class Tower extends Phaser.GameObjects.Sprite{
	constructor(scene,x,y,image){
		super(scene,x,y,image)
		this.type = undefined
		this.radius = 150
		scene.physics.world.enable(this);
		scene.add.existing(this)
		this.body.bodyType = "tower"
		this.damage = 10
		this.setScale(scene.myConfig.tileScale)//scales texture and body
		this.active = true
		this.placable = true
		this.startPosX = x
		this.startPosY = y
		this.price = 50


		let letters = "test"
		let text = this.scene.add.text(x-35, y + 30, letters);
	    text.font = "Arial";
	    // text.setOrigin(0.5);
	    text.setText( "another")
		this.text = text
		
		this.controlColliderDelay = 500;
		this.shootDelay = 1000;
		this.scene.time.addEvent({
			delay: this.shootDelay,
			callback: ()=>{
			    // spawn a bullet
			    this.controlCollider(this)
			},
			loop: true
		})
	}

	update(){
		this.updateText()
	}

	updateText(){
		if(this.active == true){
	    	this.text.setText( "active")
			this.clearTint()
		} else if(this.active == false) {
	    	this.text.setText( "non active")
		    this.setTint(0x222222);
		}
		this.text.setPosition(this.x-35,this.y+30)
	}

	controlCollider(tower){
		let collidedObj = this.scene.physics.overlapCirc(this.x,this.y,this.radius,true,false)
		if(this.active == true){
			for (let i = 0; i < collidedObj.length; i++ ){
				if(collidedObj[i].bodyType == "enemy"){
					tower.scene.createBullet(tower,collidedObj[i])
					break
				}
			}
		}
	}

	resetPosition(){
		//работает!!
		this.setX (this.startPosX)
		this.setY (this.startPosY)
	}
	
	resetPlacable(bool){
		this.placable = bool 
	}

	getPrice(){
		return this.price
	}
}