const { createServer } = require("http");
const { Server } = require("socket.io");
const uuid = require("uuid");

const httpServer = createServer();
const io = new Server(httpServer, { /* options */ });
const fs = require('fs');
const path = require('path');

const Session = require('./lib/session')

io.engine.generateId = (req) => {
    return uuid.v4(); // must be unique across all Socket.IO servers
}
io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
});
let eventList = [];
if (eventList.length === 0) {
    const eventPath = path.join(__dirname, 'event');
    const eventFiles = fs.readdirSync(eventPath);
    eventFiles.forEach((file) => {
        console.log(`[EVENT] Load event ${file}`)
        const event = require(path.join(eventPath, file));
        eventList.push(event);
    });
}

io.on("connection", (socket) => {
    console.log(`[CLIENT] a user connected: ${socket.id}`);
    const session = new Session(socket)

    eventList.forEach((event) => {
        event.run(session, socket);
    });
})

httpServer.listen(3000);
console.log("listening on port 3000");