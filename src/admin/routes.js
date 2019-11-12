const express = require("express")
const path = require("path")

const { youtubeAuth } = require("../auth")
const messageQueue = require("../messaging/messageBus")

var router = express.Router()

router.get("/", (req, res) =>
    res.sendFile(path.join(__dirname + "/index.html"))
)

router.get("/meme", (req, res) =>
    res.sendFile(path.join(__dirname + "/meme.html"))
)

router.get("/authorize", (request, response) => {
    youtubeAuth.getCode(response)
})

router.get("/callback", (req, response) => {
    const { code } = req.query
    youtubeAuth.getTokensWithCode(code)
    response.redirect("/")
})

router.get("/data/meme", (req, res) => {
    var message = messageQueue.enqueue("ShowMemeAction")

    if (message) {
        res.send(message)
    } else {
        res.sendStatus(404)
    }
})

module.exports = router
