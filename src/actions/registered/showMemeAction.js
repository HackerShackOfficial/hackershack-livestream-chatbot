var {
    AbstractSimpleChatAction,
    MessageParser
} = require("multi-stream-chatbot/actions")
const fetch = require("node-fetch")
const messageBus = require("../../messaging/messageBus")

class ShowMemeAction extends AbstractSimpleChatAction {
    matchesCommand(message, ctx) {
        return new MessageParser().parseCommand(message) === "!sm"
    }

    isInvalidChat(message, ctx) {
        return !ctx || !ctx.superChat || (ctx.superChat && ctx.value < 2000000)
    }

    async makeMessage(message, ctx) {
        // TODO: disabled until I build an admin console and we get too many messages on the video
        // if (this.isInvalidChat(command, ctx)) {
        // 	return "Sorry, you need to make a $2.00 superchat to perform that action :/"
        // }

        const username = (ctx.author && ctx.author.displayName) || "(Unknown user)"

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

        messageBus.queue("ShowMemeAction", {"url": json.data.url, "author": username})
        return "Thanks for creating that meme! I'll post it now :)"
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

module.exports = ShowMemeAction
