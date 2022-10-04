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
    static disableButtonOnCondition(inputId, btnClass, minValue, maxValue) {
        const inputValue = DOM.getValueFromInputById(inputId)
        const button = document.querySelector(`.${btnClass}`)
        if (maxValue) {
            inputValue > minValue && inputValue < maxValue ? button.disabled = false : button.disabled = true
        } else {
            inputValue > 0 && inputValue < Number(DOM.getElementById('maxNumber').innerText) ? button.disabled = false : button.disabled = true
        }
    }
    static switchClasses(hideClass, showClass) {
        this.hideClass(hideClass)
        this.showClass(showClass)
    }
    static manageIdDom(id, value) {
        document.getElementById(id).value = value
    }
    static manageClickEvent(event, btnName) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById(btnName).click();
        }
    }
    static getElementById(id){
        return document.getElementById(id)
    }
}

class Game {
    #attempts = 5
    #secretNumber = 0
    #maxNumber = 20
    #wrongAttempts = []

    #randomNumber(firstNumber, lastNumber) {
        this.#secretNumber = Math.floor(Math.random() * lastNumber) + firstNumber;
    }
    startTheGameSetUp() {
        DOM.showClass('navBar');
        ['success', 'error', 'errorInformation', 'nextLevel'].forEach(item => DOM.hideClass(item))
        this.#attempts = 5
        this.#wrongAttempts = []
        this.#randomNumber(1, 19)
        DOM.manageIdDom("guessedNumber", "")
        DOM.hideClass('triedNumbers')
        DOM.changeDomByClass('maxNumber', 20)
        DOM.changeDomByClass('attemptsCount', this.#attempts)
        DOM.disableButtonOnCondition('guessedNumber', 'guessButton', 0, this.#maxNumber)
    }
    start() {
        DOM.switchClasses('centerButton', 'game')
        this.startTheGameSetUp()
    }
    onToNextLevel() {
        ['success', 'error', 'errorInformation', 'game', 'centerButton', 'triedNumbers'].forEach(item => DOM.hideClass(item))
        DOM.showClass('nextLevel')
    }
    nextLevelStart() {
        const inputValue = DOM.getValueFromInputById('numberBetween')
        if (inputValue > 14 && inputValue < 200) {
            DOM.switchClasses('nextLevel', 'game')
            DOM.hideClass('errorInformation')
            DOM.hideClass('triedNumbers')
            this.#attempts = Math.floor(Number(inputValue) * 0.25)
            this.#maxNumber = Number(inputValue)
            this.#wrongAttempts = []
            this.#randomNumber(1, Number(inputValue) - 1)
            this.#removeInputValue()
            DOM.disableButtonOnCondition('numberBetween', 'gameStart')
            DOM.changeDomByClass('attemptsCount', this.#attempts)
            DOM.changeDomByClass('maxNumber', this.#maxNumber)
        }
    }
    #userSuccess(guessedNumber) {
        DOM.switchClasses('game', 'success')
        DOM.changeDomByClass('secretNumberSuccess', this.#secretNumber)
        this.#attempts--
        this.#rememberWrongAttempts(guessedNumber)
    }
    #userError(guessedNumber) {
        DOM.switchClasses('game', 'error')
        DOM.changeDomByClass('secretNumberError', this.#secretNumber)
        this.#attempts--
        this.#rememberWrongAttempts(guessedNumber)
    }
    #removeInputValue() {
        DOM.manageIdDom('guessedNumber', '')
        DOM.manageIdDom('numberBetween', '')
        DOM.disableButtonOnCondition('guessedNumber', 'guessButton', 0, this.#maxNumber)
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
        if (guessedNumber > 0 && guessedNumber < Number(DOM.getElementById('maxNumber').innerHTML)) this.#guessPrivate(guessedNumber)
    }
    #guessPrivate(guessedNumber) {
        if (guessedNumber === this.#secretNumber) {
            this.#userSuccess(guessedNumber)
        } else {
            if (this.#attempts > 1) {
                this.#userWrongAttempt(guessedNumber)
            } else {
                this.#userError(guessedNumber)
            }
        }
    }
}
DOM.hideClass('game')
DOM.hideClass('navBar')

const game = new Game()
game.startTheGameSetUp()

const firstInput = DOM.getElementById("guessedNumber");
const secondInput = DOM.getElementById("numberBetween");

firstInput.addEventListener("keypress", function (event) {
    DOM.manageClickEvent(event, "guessButton")
});
secondInput.addEventListener("keypress", function (event) {
    DOM.manageClickEvent(event, "gameStart")
});