const express = require("express");
const app = express();
const path = require("path");
const socketIo = require("socket.io");
const helmet = require("helmet");
const cors = require('cors');

app.use(cors({
    origin: '*'
}));
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));


const expressServer = app.listen(8080, ()=>{
    console.log("server has been started on port 8080");
})

const io = socketIo(expressServer);

module.exports = {
    app,
    io,
}