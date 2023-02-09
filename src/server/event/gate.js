const prisma = require("../lib/db");

exports.run = (session, socket) => {
    socket.emit("gate", { message: "[SERVER] Hello, what is your name?" }, async (data) => {
        console.log(`[${socket.id}] user name: ${data.name}`);
        socket.emit("system", { message: `[SERVER] Welcome, ${data.name} You are now connected to the server` })
        // if prisma user not exist create one user new
        await prisma.user.findUnique({
            where: {
                clientid: data.clientid
            }
        }).then(async (user) => {
            if (user) {
                console.log(`[DB] user exist: ${user.name}`);

                // jika session ada lebih dari 3
                session.set(user)

            } else {
                console.log(`[DB] user not exist: ${data.name}`);
                await prisma.user.create({
                    data: {
                        name: data.name,
                        clientid: data.clientid,
                        ownerId: data.ownerid,
                        Session: {
                            create: {
                                socketid: this.id,
                                // set expire date
                            }
                        }

                    }
                }).then((user) => {
                    console.log(`[DB] user created: ${user.name}`);
                    this.socket.emit("system", { message: `[SERVER] User has been register` })
                }).catch((error) => {
                    console.log(`[DB}] user not created: ${error}`);
                    this.socket.emit("system", { message: `[SERVER] User has not been register` })
                });
            }
        })

    });
}