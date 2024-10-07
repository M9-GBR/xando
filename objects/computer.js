export default class Computer {
    constructor(char = '', game) {
        this.char = char
        this.game = game
    }

    play() {
        let played = false, index,
            empty = 0, emptyIndex = 0, filledComp = 0, filledOpp = 0, tempArr

        for (const arr of this.game.winPatterns) {
            let [a, b, c] = arr

            tempArr = [this.game.boardArr[a], this.game.boardArr[b], this.game.boardArr[c]]
            emptyIndex = tempArr.indexOf('')
            empty = 0, filledComp = 0

            if (emptyIndex == -1) continue
            else {
                tempArr.forEach(val => {
                    if (val == '') empty++

                    if (val == this.char) filledComp++
                })

                if (filledComp == 2 && empty == 1) {
                    index = arr[emptyIndex]
                    played = true
                    break
                }
            }
        }

        if (!played) {
            for (const arr of this.game.winPatterns) {
                let [a, b, c] = arr

                tempArr = [this.game.boardArr[a], this.game.boardArr[b], this.game.boardArr[c]]
                emptyIndex = tempArr.indexOf('')
                empty = 0, filledOpp = 0

                if (emptyIndex == -1) continue
                else {
                    tempArr.forEach(val => {
                        if (val == '') empty++

                        if (val != this.char && val != '') filledOpp++
                    })

                    if (filledOpp == 2 && empty == 1) {
                        index = arr[emptyIndex]
                        played = true
                        break
                    }
                }
            }
        }

        if (!played) {
            for (const arr of this.game.winPatterns) {
                let [a, b, c] = arr

                tempArr = [this.game.boardArr[a], this.game.boardArr[b], this.game.boardArr[c]]
                empty = 0
                filledComp = 0

                let emptyArr = [tempArr.indexOf(''), tempArr.lastIndexOf('')],
                    randEmpty = emptyArr[Math.floor(Math.random() * emptyArr.length)]

                tempArr.forEach(val => {
                    if (val == '') empty++
                    else if (val == this.char) filledComp++
                })

                if (empty == 2 && filledComp == 1) {
                    index = arr[randEmpty]
                    played = true
                    break
                }
            }
        }

        if (!played) {
            do {
                index = Math.floor(Math.random() * this.game.boardArr.length)
            } while (this.game.boardArr[index] != '')
        }


        let pos = this.game.refArr[index]
        this.game.boardArr[index] = this.char
        this.game.drawChar(pos[0], pos[1], this.char)
    }
}