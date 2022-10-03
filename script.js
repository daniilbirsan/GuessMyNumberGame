class DOM {
    static hideClass(className) {
        document.querySelector(`.${className}`).style.display = 'none';
    }
    static showClass(className) {
        document.querySelector(`.${className}`).style.display = 'block';
    }
    static changeDomByClass(className, text) {
        document.querySelector(`.${className}`).innerText = text
    }
    static getValueFromInputById(id) {
        return document.getElementById(id).value
    }
    static disableButtonOnCondition() {
        const inputValue = document.getElementById('guessedNumber').value
        const button = document.querySelector('.guessButton')
        inputValue > 0 && inputValue < 20 ? button.disabled = false : button.disabled = true
    }
    static switchClasses(hideClass, showClass) {
        this.hideClass(hideClass)
        this.showClass(showClass)
    }
}

class Game {
    #attempts = 5
    #secretNumber = 0
    #wrongAttempts = []

    #randomNumber(firstNumber, lastNumber) {
        this.#secretNumber = Math.floor(Math.random() * lastNumber) + firstNumber;
    }
    startTheGameSetUp() {
        ['success', 'error', 'errorInformation'].forEach(item => DOM.hideClass(item))
        this.#attempts = 5
        this.#wrongAttempts = []
        this.#randomNumber(1, 19)
        document.getElementById("guessedNumber").value = "";
        DOM.hideClass('triedNumbers')
        DOM.changeDomByClass('attemptsCount', this.#attempts)
        DOM.disableButtonOnCondition()
    }
    start() {
        DOM.switchClasses('centerButton', 'game')
        this.startTheGameSetUp()
    }
    #userSuccess() {
        DOM.switchClasses('game', 'success')
        DOM.changeDomByClass('secretNumberSuccess', this.#secretNumber)
    }
    #userError() {
        DOM.switchClasses('game', 'error')
        DOM.changeDomByClass('secretNumberError', this.#secretNumber)
    }
    #removeInputValue() {
        document.getElementById('guessedNumber').value = ''
        DOM.disableButtonOnCondition()
    }
    #rememberWrongAttempts(guessedNumber) {
        DOM.showClass('triedNumbers')
        this.#wrongAttempts.push(guessedNumber)
        DOM.changeDomByClass('attemptsRemember', this.#wrongAttempts)
    }
    #mutateDomWrongAttempt(guessedNumber) {
        DOM.showClass('errorInformation')
        DOM.changeDomByClass('attemptsCount', this.#attempts)
        DOM.changeDomByClass('attemptsLeft', this.#attempts)
        DOM.changeDomByClass('secretNumber', guessedNumber)
    }
    #userWrongAttempt(guessedNumber) {
        this.#attempts--
        this.#mutateDomWrongAttempt(guessedNumber)
        this.#removeInputValue()
        this.#rememberWrongAttempts(guessedNumber)
        this.#secretNumber > guessedNumber ? DOM.changeDomByClass('numberStatus', 'greater') : DOM.changeDomByClass('numberStatus', 'less')
    }
    guess() {
        const guessedNumber = Number(DOM.getValueFromInputById('guessedNumber'))
        if (guessedNumber > 0 && guessedNumber < 20) this.#guessPrivate(guessedNumber)
    }
    #guessPrivate(guessedNumber) {
        if (guessedNumber === this.#secretNumber) {
            this.#userSuccess()
        } else {
            if (this.#attempts > 1) {
                this.#userWrongAttempt(guessedNumber)
            } else {
                this.#userError()
            }
        }
    }
}
DOM.hideClass('game')

const game = new Game()
game.startTheGameSetUp()