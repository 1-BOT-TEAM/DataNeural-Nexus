const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    // send callback to server
});

// listen to event gate and send callback
socket.on("gate", (data, callback) => {
    console.log(data.message);
    callback({ message: "Hello from client", name: "John", ownerid: "Bob", clientid: "1213131231731331243" });
    // wait for callback from server
})

socket.on("system", (data, callback) => {
    console.log(data.message);
})

// send event db and wait for callback

setTimeout(() => {
    console.log('5 seconds have passed!');
    socket.emit("db", { query: "SELECT * FROM table" }, (data) => {
        console.log(data.message);
    })
}, 5000);


socket.on("disconnect", () => {
    console.log("disconnected");
})
