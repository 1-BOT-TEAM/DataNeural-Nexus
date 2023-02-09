// get socket, data, callback
const prisma = require("../lib/db");

exports.run = async (session, socket, callback) => {
    socket.on("disconnect", async () => {
        session.delete()
        console.log(`[CLIENT] user disconnected: ${socket.id}`);
    })
}