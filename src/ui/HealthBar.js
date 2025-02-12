import Phaser from 'phaser'

//class represents Healt Bar of End or Enemy
export default class HealthBar {

    constructor (scene, obj){
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.owner = obj

        this.x = obj.x - this.width/2
        this.y = obj.y - obj.height/4 -10;
        this.value = obj.health;
        this.width = 60
        this.p = (this.width - 4) / this.value;

        this.draw();

        scene.add.existing(this.bar);
    }

    //updates positon and redraw bar
    update(pos){
        this.x = pos.x - this.width/2
        this.y = pos.y - pos.height/4 -10
        this.draw();
    }

    //decrease current amount
    decrease (amount) {
        this.value -= amount;
        if (this.value < 0) {
            this.value = 0;
        }
        this.draw()
        return (this.value === 0);
    }

    //every call redrav bar
    //depend on current HP draw in 2 colors (green and red)
    draw () {
        this.bar.clear();

        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, this.width, 10);

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, this.width -4, 6);

        if (this.value < 30) {
            this.bar.fillStyle(0xff0000);
        } else {
            this.bar.fillStyle(0x00ff00);
        }

        let d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 2, this.y + 2, d, 6);
    }

}