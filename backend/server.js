const  express  = require("express");
const cors = require('cors');
const { chats } = require("./data/data");
const { DB_connect } = require("./config/db");
const env = require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound } = require("./middlewares/notFound");
const app = express();

DB_connect();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);

const server = app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})

const io = require("socket.io")(server, {
    pingTimeout: 10000,
    cors: {
        origin: "http://localhost:5173",
    }
});

io.on("connection", (socket) => {
    console.log("Connected to Socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    })
    socket.on("join room", (room) => {
        socket.join(room);
        console.log("Room joined: ", room);
    })

    socket.on("new message", (newMessage) => {
        const chat = newMessage.chat;
        chat?.users?.forEach(user => {
            if(user != userData._id)
                socket.in(user._id).emit("message received", newMessage.content);
        });
    })
})