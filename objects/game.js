import Computer from "./computer.js"
import Player from "./player.js"
import PTabUpdater from "./ptab.js"

export default class Game {
    constructor() {
        this.updater.update()
        this.createBoard()
        this.startGame()
    }

    updater = new PTabUpdater(this)

    sqrLength = 100
    quartLength = this.sqrLength / 4
    halfLength = this.sqrLength / 2
    lineW = 2
    boardArr = new Array(9).fill("")

    refArr = [
        [0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]
    ]
    winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]
    winSqrs = []

    player1 = new Player("x", this)
    player2 = new Computer("o", this)
    p1Score = 0
    p2Score = 0
    clickable = false

    currentPlayer = this.player1
    cP = this.currentPlayer

    animFrame
    compTimer

    startGame() {
        if (this.currentPlayer.__proto__.constructor.name == 'Computer') {
            this.currentPlayer.play()
        } else {
            this.clickable = true
        }
    }

    run() {
        if (this.checkWinner()) {
            this.drawWinLine()

            if (this.currentPlayer == this.player1) {
                this.p1Score++
            } else {
                this.p2Score++
            }
        } else if (this.checkDraw()) {
            this.drawFunc()
        } else {
            if (this.currentPlayer == this.player1) {
                this.setCurrentPlayer(2)
            } else this.setCurrentPlayer(1)

            if (this.currentPlayer.__proto__.constructor.name == 'Computer') {
                this.compTimer = setTimeout(() => {
                    this.currentPlayer.play()
                }, 500)
            } else {
                this.clickable = true
            }
        }

        this.updater.update()
    }

    createBoard() {
        this.canvas = document.createElement('canvas')
        this.canvas.id = 'gameCanvas'
        this.canvas.width = this.sqrLength * 3
        this.canvas.height = this.sqrLength * 3
        document.getElementById('wrap').appendChild(this.canvas)

        this.canvas.onclick = (ev) => this.handleClick(ev)

        this.ctx = this.canvas.getContext('2d')

        this.drawLines()
    }

    drawLines() {
        this.ctx.lineWidth = this.lineW
        this.ctx.strokeStyle = 'black'

        this.ctx.beginPath()
        this.ctx.moveTo(this.sqrLength, 0)
        this.ctx.lineTo(this.sqrLength, this.sqrLength * 3)

        this.ctx.moveTo(this.sqrLength * 2, 0)
        this.ctx.lineTo(this.sqrLength * 2, this.sqrLength * 3)

        this.ctx.moveTo(0, this.sqrLength)
        this.ctx.lineTo(this.sqrLength * 3, this.sqrLength)

        this.ctx.moveTo(0, this.sqrLength * 2)
        this.ctx.lineTo(this.sqrLength * 3, this.sqrLength * 2)
        this.ctx.stroke()
    }

    convertIndex(index) {
        return (index * this.sqrLength)
    }

    drawBoard() {
        this.drawLines()

        this.ctx.lineWidth = 5
        this.ctx.strokeStyle = 'black'

        this.boardArr.forEach((char, index) => {
            let indexPos = this.refArr[index],
                x = this.convertIndex(indexPos[0]),
                y = this.convertIndex(indexPos[1])

            if (char == 'x') {
                let x1 = x + (this.sqrLength / 4),
                    y1 = y + (this.sqrLength / 4),
                    x2 = x + (this.sqrLength * 3 / 4),
                    y2 = y + (this.sqrLength * 3 / 4)

                this.ctx.beginPath()
                this.ctx.moveTo(x1, y1)
                this.ctx.lineTo(x2, y2)

                this.ctx.moveTo(x2, y1)
                this.ctx.lineTo(x1, y2)
                this.ctx.stroke()
            } else if (char == 'o') {
                let x1 = x + (this.sqrLength / 2),
                    y1 = y + (this.sqrLength / 2)

                this.ctx.beginPath()
                this.ctx.arc(x1, y1, this.quartLength, 0, Math.PI * 2)
                this.ctx.stroke()
            }
        })
    }

    handleClick(ev = new MouseEvent()) {
        let padding = parseInt(getComputedStyle(this.canvas).padding)

        let x = ev.offsetX - padding, y = ev.offsetY - padding
        x = Math.floor(x / this.sqrLength)
        y = Math.floor(y / this.sqrLength)

        this.refArr.forEach((arr, index) => {
            if (arr[0] == x && arr[1] == y) {
                if (this.boardArr[index] == "" && this.currentPlayer.__proto__.constructor.name == 'Player' && this.clickable) {
                    this.clickable = false
                    this.boardArr[index] = this.currentPlayer.char
                    this.drawChar(x, y, this.currentPlayer.char)
                }
            }
        })
    }

    drawChar(x, y, char) {
        x *= this.sqrLength
        y *= this.sqrLength

        if (char == 'x') {
            this.drawX(x, y, this.ctx)
        } else this.drawO(x, y, this.ctx)
    }

    drawX(x, y, ctx = new CanvasRenderingContext2D()) {
        let startX = x + (this.quartLength),
            startY = y + (this.quartLength),
            endX = x + (this.sqrLength * 3 / 4),
            endY = y + (this.sqrLength * 3 / 4),
            animX = startX, animY = startY, game = this

        ctx.lineWidth = 5

        function clearAnim() {
            ctx.clearRect(
                x + (game.lineW), y + (game.lineW), game.sqrLength - (game.lineW + 1), game.sqrLength - (game.lineW + 1)
            )
        }

        function stroke(x1, y1, x2, y2) {
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
        }

        function xAnimate1() {
            clearAnim()

            animX += game.sqrLength / 50
            animY += game.sqrLength / 50

            stroke(startX, startY, animX, animY)

            if (animX != endX && animY != endY) {
                game.animFrame = requestAnimationFrame(xAnimate1)
            } else {
                animX = endX, animY = startY
                xAnimate2()
            }
        }

        function xAnimate2() {
            clearAnim()

            stroke(startX, startY, endX, endY)

            animX -= game.sqrLength / 50
            animY += game.sqrLength / 50

            stroke(endX, startY, animX, animY)

            if (animX != startX && animY != endY) {
                game.animFrame = requestAnimationFrame(xAnimate2)
            } else game.run()
        }

        xAnimate1()
    }

    drawO(x, y, ctx = new CanvasRenderingContext2D()) {
        let startAngle = 0, game = this

        ctx.lineWidth = 5

        function oAnimate() {
            ctx.clearRect(
                x + (game.lineW), y + (game.lineW), game.sqrLength - (game.lineW + 1), game.sqrLength - (game.lineW + 1)
            )

            ctx.beginPath()
            ctx.arc(x + (game.halfLength), y + (game.halfLength), game.quartLength, 0, (Math.PI * startAngle) / 180)
            ctx.stroke()

            if (startAngle != 360) {
                game.animFrame = requestAnimationFrame(oAnimate)
            } else game.run()

            startAngle += game.sqrLength / 10
        }

        oAnimate()
    }

    checkWinner() {
        return this.winPatterns.some(pattern => {
            let [a, b, c] = pattern
            this.winSqrs = pattern
            return this.boardArr[a] == this.boardArr[b] && this.boardArr[b] == this.boardArr[c] && this.boardArr[c] != ""
        })
    }

    checkDraw() {
        return this.boardArr.every(char => char != "")
    }

    winFunc() {

    }

    drawFunc() {

    }

    drawWinLine() {
        let x1 = this.convertIndex(this.refArr[this.winSqrs[0]][0]) + this.halfLength,
            y1 = this.convertIndex(this.refArr[this.winSqrs[0]][1]) + this.halfLength,
            x2 = this.convertIndex(this.refArr[this.winSqrs[2]][0]) + this.halfLength,
            y2 = this.convertIndex(this.refArr[this.winSqrs[2]][1]) + this.halfLength,
            animX = x1, animY = y1, game = this, strokeSpeed = this.sqrLength / 10

        if ((y2 - y1) == 0 && (x2 - x1) != 0) {
            x2 += this.quartLength
            x1 -= this.quartLength
        }

        if ((x2 - x1) == 0 && (y2 - y1) != 0) {
            y2 += this.quartLength
            y1 -= this.quartLength
        }

        if ((x2 - x1) != 0 && (y2 - y1) != 0) {
            if (x2 < x1) {
                x2 -= this.quartLength
                x1 += this.quartLength
                y2 += this.quartLength
                y1 -= this.quartLength
            } else {
                x2 += this.quartLength
                x1 -= this.quartLength
                y2 += this.quartLength
                y1 -= this.quartLength
            }
            animX = x1, animY = y1
        }

        function animate() {
            game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height)
            game.drawBoard()

            if (x2 - x1 != 0) {
                if (x2 > x1) {
                    animX += strokeSpeed
                } else {
                    animX -= strokeSpeed
                }
            }

            if (y2 - y1 != 0) {
                if (y2 > y1) {
                    animY += strokeSpeed
                } else {
                    animY -= strokeSpeed
                }
            }

            game.ctx.lineWidth = 8
            game.ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)'

            game.ctx.beginPath()
            game.ctx.moveTo(x1, y1)
            game.ctx.lineTo(animX, animY)
            game.ctx.stroke()

            if (!(animX >= x2 && animY >= y2)) {
                game.animFrame = requestAnimationFrame(animate)
            } else game.winFunc()
        }

        animate()
    }

    clearAnimFrames() {
        cancelAnimationFrame(this.animFrame)
        clearInterval(this.compTimer)
    }

    clear() {
        this.clearAnimFrames()

        this.boardArr = new Array(9).fill("")
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawBoard()

        if (this.cP == this.player1) {
            this.setCurrentPlayer(2)
        } else {
            this.setCurrentPlayer(1)
        }

        this.startGame()

        this.updater.update()
    }

    reset() {
        this.clearAnimFrames()

        this.boardArr = new Array(9).fill("")
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawBoard()

        this.resetScores()
    }

    resetScores() {
        this.p1Score = 0
        this.p2Score = 0
    }

    setCurrentPlayer(num) {
        this.currentPlayer = this[`player${num}`]
        this.cP = this.currentPlayer
    }
}