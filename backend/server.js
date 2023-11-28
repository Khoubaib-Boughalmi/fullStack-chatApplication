const  express  = require("express");
const cors = require('cors');
const { chats } = require("./data/data");
const { DB_connect } = require("./config/db");
const env = require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound } = require("./middlewares/notFound");
const app = express();

DB_connect();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})