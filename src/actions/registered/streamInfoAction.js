var {
    AbstractSimpleChatAction,
    MessageParser
} = require("multi-stream-chatbot/actions")
const fetch = require("node-fetch")

class StreamInfoAction extends AbstractSimpleChatAction {
    matchesCommand(message, ctx) {
        return new MessageParser().parseCommand(message) === "!stream_info"
    }

    async makeMessage(message, ctx) {
        const rawStreamJson = await this.getRawStreamInfo()

        return `
			TWITCH:
			Stream Category: ${this.getStreamCategory(rawStreamJson)},
			Seconds Streaming: ${this.getStreamTime(rawStreamJson)},
			Average FPS: ${this.getAvgFPS(rawStreamJson)}
		`
    }

    async getRawStreamInfo() {
        const resp = await fetch(
            `https://api.twitch.tv/kraken/streams/${process.env.TWITCH_CHANNEL_ID}`,
            { headers: { "Client-ID": process.env.TWITCH_CLIENT_ID } }
        )
        return await resp.json()
    }

    getStreamTime(rawStreamJson) {
        const created_at_str = this.extractCreatedAt(rawStreamJson)
        const created_at = new Date(created_at_str)
        const now = new Date()
        const delta = (now.getTime() - created_at.getTime()) / 1000.0
        return delta
    }

    getStreamCategory(rawStreamJson) {
        return rawStreamJson.stream.game
    }

    getAvgFPS(rawStreamJson) {
        return rawStreamJson.stream.average_fps
    }

    extractCreatedAt(rawStreamJson) {
        return rawStreamJson.stream.created_at
    }
}

module.exports = StreamInfoAction
