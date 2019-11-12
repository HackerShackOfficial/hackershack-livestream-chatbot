var {
    AbstractSimpleChatAction,
    MessageParser
} = require("multi-stream-chatbot/actions")
const fetch = require("node-fetch")

class MemeAction extends AbstractSimpleChatAction {
    matchesCommand(message, ctx) {
        return new MessageParser().parseCommand(message) === "!meme"
    }

    async makeMessage(message, ctx) {
        const commandParts = message.split("|")
        const memeName = commandParts[1].trim()
        const memeID = await this.getMemeID(memeName)

        if (!memeID) {
            return `Sorry, I couldn't find "${memeName}"`
        }

        const topText = encodeURIComponent(commandParts[2].trim())
        const bottomText = encodeURIComponent(commandParts[3].trim())

        const resp = await fetch(
            `https://api.imgflip.com/caption_image?template_id=${memeID}&username=${process.env.IMGFLIP_USERNAME}&password=${process.env.IMGFLIP_PASSWORD}&text0=${topText}&text1=${bottomText}`,
            { method: "post" }
        )
        const json = await resp.json()
        return json.data.url
    }

    async getMemeID(memeName) {
        const resp = await fetch("https://api.imgflip.com/get_memes")
        const json = await resp.json()

        const memes = json.data.memes

        for (var i = 0; i < memes.length; i++) {
            const meme = memes[i]
            if (meme.name.toLowerCase() === memeName.toLowerCase()) {
                return meme.id
            }
        }
    }
}

module.exports = MemeAction
