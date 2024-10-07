import Player from "./player.js"
import Computer from "./computer.js"

export default class PTabUpdater {
    constructor(game) {
        this.game = game
        this.addListeners()
    }

    p1 = document.getElementById('p1')
    p2 = document.getElementById('p2')
    p1Img = document.getElementById('p1-img')
    p2Img = document.getElementById('p2-img')
    p1Score = document.getElementById('p1-score')
    p2score = document.getElementById('p2-score')
    resetBtn = document.getElementById('reset')
    pImg = './svgs/user.svg'
    cImg = './svgs/desktop.svg'

    addListeners() {
        this.resetBtn.addEventListener('click', () => {
            this.game.clear()
        })

        this.p1.addEventListener('click', () => {
            this.game.reset()

            if (this.game.player1.__proto__.constructor.name == 'Computer') {
                this.game.player1 = new Player('x')
            } else {
                this.game.player1 = new Computer('x', this.game)
            }

            this.game.setCurrentPlayer(1)

            this.game.startGame()
            this.update()
        })

        this.p2.addEventListener('click', () => {
            this.game.reset()

            if (this.game.player2.__proto__.constructor.name == 'Computer') {
                this.game.player2 = new Player('o')
            } else {
                this.game.player2 = new Computer('o', this.game)
            }

            this.game.setCurrentPlayer(1)

            this.game.startGame()
            this.update()
        })
    }

    update() {
        if (this.game.player1.__proto__.constructor.name == 'Computer') {
            this.p1Img.src = this.cImg
        } else this.p1Img.src = this.pImg

        if (this.game.player2.__proto__.constructor.name == 'Computer') {
            this.p2Img.src = this.cImg
        } else this.p2Img.src = this.pImg

        this.p1Score.textContent = this.game.p1Score 
        this.p2score.textContent = this.game.p2Score

        if (this.game.currentPlayer == this.game.player1) {
            this.p1.style.backgroundColor = 'rgba(0, 255, 0, 0.6)'
            this.p2.style.backgroundColor = 'transparent'
        } else {
            this.p1.style.backgroundColor = 'transparent'
            this.p2.style.backgroundColor = 'rgba(0, 255, 0, 0.6)'
        }
    }
}