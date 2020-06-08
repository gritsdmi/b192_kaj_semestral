import Phaser from 'phaser'
import HealthBar from "../ui/HealthBar"


export default class End extends Phaser.GameObjects.Sprite {
  constructor(scene,pos){
    super(scene,pos.x,pos.y,"end")
    this.health = 100
	this.damage = 10
	// console.log(pos.x)
	this.x = pos.x
	// console.log(this.x)
    this.y = pos.y
	this.hp = new HealthBar(scene, this);
	// this.hp.x = 29
	this.hp.update({x:this.x, y:this.y-40, height:50})
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this)
    this.setScale(scene.myConfig.tileScale)
  }

  hit(end,enemy){
    end.health -= end.damage
    end.hp.decrease(end.damage)
	enemy.destroyAll()
	end.update()
  }

  update() {
    this.controlHealth()
    this.hp.update({x:this.x, y:this.y-40, height:50})

  }

  controlHealth(){
	// console.log("control")

    if(this.health <=0){
      this.scene.gameOver = true
    }
  }
}
