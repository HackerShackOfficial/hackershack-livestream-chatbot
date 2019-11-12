// index.js
const path = require("path")
const express = require("express")

const { StreamBot } = require("multi-stream-chatbot")
const {
    TwitchStream,
    YoutubeStream,
    DummyStream
} = require("multi-stream-chatbot/streams")

const config = require("./config")
const adminRoutes = require("./admin/routes")
const { youtubeAuth, twitchAuth } = require("./auth")
const { registerActions } = require("./actions/util")

const server = express()

server.use("/", adminRoutes)

server.listen(3000, function() {
    console.log("* Admin Server is Ready")
})

const actions = registerActions(path.join(__dirname, "actions/registered"))

const bot = new StreamBot({
    streams: [new YoutubeStream(youtubeAuth), new TwitchStream(twitchAuth)],
    actions,
    config
})

// const bot = new StreamBot({
// 	streams: [new DummyStream('!meme | Success kid | Parallel charging | works!')],
// 	actions,
// 	config
// })

bot.start()
