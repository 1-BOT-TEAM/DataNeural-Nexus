const prisma = require('./db')
const Cache = require('./DBcache')

class Session {
    constructor(socket) {
        this.socket = socket
        this.id = socket.id
        this.cache = new Cache()
    }

    async set(user) {
        await prisma.session.findMany({
            where: {
                user: {
                    id: user.id
                }
            }
        }).then(async (sessions) => {
            if (sessions.length > 0) {
                console.log(`[SESSION] session limit: ${sessions.length}`);
                this.socket.emit("system", { message: `[SERVER] Session limit reached`, code: 401 })
                this.socket.disconnect();
            } else {
                prisma.session.create({
                    data: {
                        socketid: this.id,
                        // set expire date
                        user: {
                            connect: {
                                id: user.id
                            }
                        }
                    }
                }).then((session) => {
                    this.cache.set(this.id, true)
                    console.log(`[SESSION] session created: ${session.socketid}`);
                    this.socket.emit("system", { message: `[SERVER] Session has been created`, code: 200 })

                })

                console.log(`[SESSION] session not limit: ${sessions.length}`);
            }
        }).catch((error) => {
            console.log(`[SESSION] session error: ${error}`);
        })

    }

    async delete() {
        this.cache.delete(this.id)
        await prisma.session.findUnique({
            where: {
                socketid: this.id
            }
        }).then(async (session) => {
            if (session) {
                await prisma.session.delete({
                    where: {
                        socketid: session.socketid
                    }
                }).then((session) => {
                    console.log(`[SESSION] session deleted: ${session.socketid}`);
                })
            } else {
                console.log(`[SESSION] session not exist: ${this.id}`);
            }
        })
    }
    async check() {
        return await this.cache.has(this.id)
    }
}

module.exports = Session