class MessageBus {
    constructor() {
        this.bus = {}
    }

    queue(key, message) {
        if (this.bus[key] === undefined) {
            this.bus[key] = []
        }

        this.bus[key].unshift(message)
    }

    enqueue(key) {
        if (this.bus[key]) {
            return this.bus[key].pop()
        }
    }
}

module.exports = new MessageBus()
