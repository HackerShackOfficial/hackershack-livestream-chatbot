var {
    AbstractStrategyBasedChatAction,
    AbstractMessageStrategy,
    MessageParser
} = require("multi-stream-chatbot/actions")

// !makepoll | poll_question | option_1 | option_2 -> Create a poll (maybe limit to certain users)
// !vote | option -> Vote for an option in the poll
// !endpoll -> Ends the current poll (limit to certain user)
// !viewpoll -> View the poll and current options

class Poll {
    constructor(question, options, creator) {
        this.question = question
        this.options = options
        this.creator = creator
        this.voters = []
    }

    hasVoter(voter) {
        return this.voters.includes(voter)
    }

    addVoter(voter) {
        this.voters.push(voter)
    }
}

class PollOption {
    constructor(name) {
        this.name = name
        this.votes = 0
    }

    incrementVote() {
        this.votes += 1
    }
}

class MakePollStrategy extends AbstractMessageStrategy {
    constructor(pollAction) {
        super()
        this.pollAction = pollAction
    }

    matches(message, ctx) {
        return new MessageParser().parseCommand(message) === "!makepoll"
    }

    async makeMessage(message, ctx) {
        if (this.pollAction.getCurrentPoll()) {
            return "Sorry, a poll already exists. Please end the poll to create a new one."
        }

        const commandParts = message.split("|")
        const pollQuestion = commandParts[1].trim()
        const option1 = commandParts[2].trim().toLowerCase()
        const option2 = commandParts[3].trim().toLowerCase()

        const username = (ctx.author && ctx.author.displayName) || "(Unknown user)"

        const options = [new PollOption(option1), new PollOption(option2)]
        const poll = new Poll(pollQuestion, options, username)

        this.pollAction.setCurrentPoll(poll)

        return `I've created a poll for "${pollQuestion}". Use "!vote | OPTION_NAME" to vote for an option.`
    }
}

class ViewPollStrategy extends AbstractMessageStrategy {
    constructor(pollAction) {
        super()
        this.pollAction = pollAction
    }

    matches(message, ctx) {
        return new MessageParser().parseCommand(message) === "!viewpoll"
    }

    async makeMessage(message, ctx) {
        const poll = this.pollAction.getCurrentPoll()

        if (!poll) {
            return "A poll doesn't exist right now. Try again when there is an active poll."
        }

        var optionsResults = []
        for (const option of poll.options) {
            optionsResults.push(`${option.name}=${option.votes}`)
        }

        const optionResultsStr = optionsResults.join(", ")
        return `Poll: ${poll.question} (created by: ${poll.creator}) ${optionResultsStr}`
    }
}

class VoteStrategy extends AbstractMessageStrategy {
    constructor(pollAction) {
        super()
        this.pollAction = pollAction
    }

    matches(message, ctx) {
        return new MessageParser().parseCommand(message) === "!vote"
    }

    async makeMessage(message, ctx) {
        const poll = this.pollAction.getCurrentPoll()

        if (!poll) {
            return "A poll doesn't exist right now. Try again when there is an active poll."
        }

        const commandParts = message.split("|")
        const userOption = commandParts[1].trim().toLowerCase()

        const author_id = ctx.author.id
        const username = (ctx.author && ctx.author.displayName) || "(Unknown user)"

        if (!author_id) {
            return
        }

        if (poll.hasVoter(author_id)) {
            return `Sorry, ${username}, you have already voted`
        }

        var validOption = undefined

        for (const option of poll.options) {
            if (option.name === userOption) {
                validOption = option
            }
        }

        if (!validOption) {
            return `Sorry, ${username}, that was not a valid option (${userOption})`
        }

        validOption.incrementVote()
        poll.addVoter(author_id)

        return `Thanks ${username}, I have recorded your vote.`
    }
}

class ClosePollStrategy extends AbstractMessageStrategy {
    constructor(pollAction) {
        super()
        this.pollAction = pollAction
    }

    matches(message, ctx) {
        return new MessageParser().parseCommand(message) === "!closepoll"
    }

    async makeMessage(message, ctx) {
        const poll = this.pollAction.getCurrentPoll()

        if (!poll) {
            return "A poll doesn't exist right now. Try again when there is an active poll."
        }

        var winningResult = undefined

        for (const option of poll.options) {
            if (!winningResult || winningResult && winningResult.votes < option.votes) {
               winningResult = option
            }
        }

        const optionResultsStr = `${winningResult.name} wins with ${winningResult.votes} votes`
        return `Poll: ${poll.question} (created by: ${poll.creator}), ${optionResultsStr}`
    }
}

class PollAction extends AbstractStrategyBasedChatAction {
    registerStrategies() {
        return [
            new MakePollStrategy(this),
            new ViewPollStrategy(this),
            new VoteStrategy(this),
            new ClosePollStrategy(this)
        ]
    }

    getCurrentPoll() {
        return this.currentPoll
    }

    setCurrentPoll(poll) {
        this.currentPoll = poll
    }
}

module.exports = PollAction
