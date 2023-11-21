const  express  = require("express");
const cors = require('cors');
const { chats } = require("./data/data");
const { DB_connect } = require("./config/db");
const env = require("dotenv").config();

const app = express();

app.use(cors());
DB_connect();

app.get("/", (req, res) => {
    res.send("Hello world");
})

app.get("/api/chats", (req, res) => {
    res.send(chats);
})

app.get("/api/chat/:chatId", (req, res) => {
    let chat = chats.find(elem => elem._id == req.params.chatId)
    res.send(chat);
})

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})