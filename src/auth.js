// youtubeAuth.js
const TwitchAuth = require("multi-stream-chatbot/auth/twitch")
const YoutubeAuth = require("multi-stream-chatbot/auth/youtube")

youtubeAuth = new YoutubeAuth({
    clientId: process.env.YOUTUBE_CHAT_CLIENT_ID,
    clientSecret: process.env.YOUTUBE_CHAT_CLIENT_SECRET,
    redirectURI: "http://localhost:3000/callback",
    tokenFilePath: "./tokens.json"
})

twitchAuth = new TwitchAuth({
    oauthToken: process.env.TWITCH_BOT_KEY,
    username: "HSbot",
    channel: "HackerShackOfficial"
})

module.exports = {
    youtubeAuth: youtubeAuth,
    twitchAuth: twitchAuth
}
