// require express=> to socket server
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(express.static("public"));



//listen socket connection 
io.on('connection', function (socket) {
    console.log(socket.id)
    socket.on("color", function (color) {
        socket.broadcast.emit("oncolorChange", color);
    })

    socket.on("start",function(point){
socket.broadcast.emit("onstart",point);
    })
    socket.on("end",function(point){
socket.broadcast.emit("onend",point)
    })
});
// folder designated from which client can get files
app.use(express.static('public'));
// server start
const port=process.env.PORT||3000
server.listen(port, function (req,res) {
    console.log("Server started at port 3000")
})