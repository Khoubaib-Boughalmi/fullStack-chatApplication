const mongoose = require("mongoose");

const messageShema = mongoose.Schema (
    {
        senderId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        chat: {type: mongoose.Schema.Types.ObjectId, ref: "Chat"},
        content: {type: String, trim: true}
    },
    {timestamps: true}
)

const Message = mongoose.model("Message", messageShema);
module.exports = { Message };