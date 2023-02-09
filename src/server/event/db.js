const prisma = require("../lib/db");
exports.run = (session, socket) => {
    socket.on("db", async (data, callback) => {
        if (await session.check()) {
            console.log(`[DB] Query input: ${data.query}`)
            callback({ message: "[DB] done" })
        } else {
            console.log("[DB] Database input denied")
            callback({ message: "[DB] wait for session created", code: 401 });
        }




    })
}