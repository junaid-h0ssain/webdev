function randomNumber() {
    let randomNum = Math.floor(Math.random() * 13) + 1
    return randomNum
}

let firstCard = randomNumber()
let secondCard = randomNumber()
let sum = firstCard + secondCard
let blackJack = false
let isAlive = true
let msgElement = document.getElementById("message-el")
let message = ""
let cards = [firstCard, secondCard]
let cardsEl = document.getElementById("cards-el")



console.log("Sum: " + sum)

function startGame() {

    renderGame()
}

function renderGame() {
    cardsEl.textContent = ""
    for (let i = 0; i < cards.length; i++) {
        cardsEl.textContent += cards[i] + " "
    }
    let sumEl = document.getElementById("sum-el")
    sumEl.textContent = "" + sum

    if (sum <= 20) {
        message = "Do you want to draw a new card?"
    } else if (sum === 21) {
        message = "Wohoo! You've got Blackjack!"
        blackJack = true
    } else {
        message = "You're out of the game!"
        isAlive = false
    }
    msgElement.textContent = message
}


console.log(message)
console.log("Game's finished")