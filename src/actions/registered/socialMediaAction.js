var {
    AbstractSimpleChatAction,
    MessageParser
} = require("multi-stream-chatbot/actions")

class SocialMediaAction extends AbstractSimpleChatAction {
    matchesCommand(message, ctx) {
        return new MessageParser().parseCommand(message) === "!links"
    }

    async makeMessage(message, ctx) {
        return `
			Youtube 🎥: youtube.com/c/hackershack | 
			Instagram 📷: https://www.instagram.com/hackershackofficial/?hl=en | 
			Hackster.io 🛠: https://www.hackster.io/hackershack | 
			Github 💻: https://github.com/HackerShackOfficial | 
			Website 🏠: https://www.thehackershack.com/
		`
    }
}

module.exports = SocialMediaAction
