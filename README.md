# hackershack-livestream-chatbot

Code for the Hacker Shack livestream chatbot

## Running locally

Make sure you've set the following environment variables: 

```
# youtube
YOUTUBE_CHAT_CLIENT_ID
YOUTUBE_CHAT_CLIENT_SECRET

#twitch
TWITCH_BOT_KEY
```

You can find these values in the Twitch/Youtube chatbot documentation.

Run the following commands in the project root:

```sh
npm install
node src/index.js
```

Visit `localhost:3000` in the browser to login with Youtube.

Note: 
- You might have to restart the chatbot if you've logged in for the first time. The chatbot should persist oauth tokens so that you don't need to login every time. 
- If the Youtube stream doesn't start, you might have to create a [live event](https://www.youtube.com/my_live_events)


## How to use the Chatbot

Type the following commands to talk to the bot:

Create a meme. Meme names can be found [here](https://hackershackofficial.github.io/meme-viewer.html)
Type: `!meme | meme_name | top_text | bottom_text`
Example -  `!meme | success kid | this | works!`

Show a meme on the livestream video. (Uses the same memes as the create meme command)
Type: `!sm | meme_name | top_text | bottom_text`
Example -  `!sm | success kid | this | works!`

Polls
Create a poll
`!makepoll | poll_question | option_1 | option_2`

Vote for an option in the poll
`!vote | option_1`

End the current poll
`!endpoll`

View the poll and current options
`!viewpoll`

Get all HackerShack social media links
Type: `!links`

Roll a dice
Type: `!dice`

## Donations

Thanks for the support!

 - `Zachary Nawrocki`: Love your videos. I've been working on a chat bot for my personal home assistant project, and these ideas have given me some inspiration. Thanks.
