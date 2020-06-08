import Phaser from 'phaser'

const formatScore = (score,name) => `${name} Coins: ${score}\n`

export default class ScoreLabel extends Phaser.GameObjects.Text{
	
	constructor(scene, x, y, score, style,lvl){
		super(scene, x + 500, y, formatScore(score), style)

		this.score = score
		this.lvl = lvl
		this.playerName = scene.playerName
	}

	setScore(score){
		this.score  = score
		this.updateScoreText()
	}

	add(points){
		this.setScore(this.score + points)
	}
	
	sub(points){
		this.setScore(this.score - points)
	}

	updateScoreText(){
		this.setText(formatScore(this.score, this.playerName))
	}
	
	getScore(){
		return this.score
	}
}