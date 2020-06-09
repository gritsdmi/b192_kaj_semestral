import Phaser from 'phaser'
import HealthBar from "../ui/HealthBar"

//class represents "Castle"
//if castlte "died" game is over
export default class End extends Phaser.GameObjects.Sprite {
  constructor(scene,pos){
    super(scene,pos.x,pos.y,"end")
    this.health = 100
    this.damage = 10
    this.x = pos.x
    this.y = pos.y
    this.hp = new HealthBar(scene, this);
    this.hp.update({x:this.x, y:this.y-40, height:50})
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this)
    this.setScale(scene.myConfig.tileScale)
  }

  //function invokes when enemy collides the End
  //hp decrease and enemy die
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
    if(this.health <=0){
      this.scene.gameOver = true
    }
  }
}
