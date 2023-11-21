const  express  = require("express");
const cors = require('cors');
const { chats } = require("./data/data");

const app = express();
app.use(cors());

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

app.listen(8080, () => {
    console.log("listening on port 8080");
})