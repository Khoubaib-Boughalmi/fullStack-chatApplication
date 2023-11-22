const  express  = require("express");
const cors = require('cors');
const { chats } = require("./data/data");
const { DB_connect } = require("./config/db");
const env = require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const app = express();

DB_connect();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world");
})

app.use("/api/user", userRoutes);

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})