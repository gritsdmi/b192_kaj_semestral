import Phaser from 'phaser'

const formatScore = (score,lvl) => `Score: ${score}\n`

export default class ScoreLabel extends Phaser.GameObjects.Text{
	
	constructor(scene, x, y, score, style,lvl){
		super(scene, x, y, formatScore(score), style)

		this.score = score
		this.lvl = lvl
		// console.log(this.lvl)
	}

	setScore(score){
		this.score  = score
		this.updateScoreText()
	}

	add(points){
		this.setScore(this.score + points)
	}

	updateScoreText(){
		this.setText(formatScore(this.score, this.lvl))
	}
}