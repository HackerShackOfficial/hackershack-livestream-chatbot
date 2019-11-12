var {
    AbstractSimpleChatAction,
    MessageParser
} = require("multi-stream-chatbot/actions")

class DiceRollAction extends AbstractSimpleChatAction {
    matchesCommand(message, ctx) {
        return new MessageParser().parseCommand(message) === "!dice"
    }

    async makeMessage(message, ctx) {
        const num = this.rollDice()
        return `You rolled a ${num}`
    }

    rollDice() {
        const sides = 6
        return Math.floor(Math.random() * sides) + 1
    }
}

module.exports = DiceRollAction
