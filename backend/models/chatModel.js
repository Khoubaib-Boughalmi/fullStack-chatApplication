const mongoose = require("mongoose");

const chatShema = mongoose.Schema(
    {
        chatName: {type: String, trim: true},
        isGroupChat: {type: Boolean, default: false},
        users: [ {type: mongoose.Schema.Types.ObjectId, ref: 'User'} ],
        lastMessage: {type: mongoose.Schema.Types.ObjectId, ref: 'Message'},
        groupAdmin: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        groupAvatar: {type: String},
    }, { timestamps: true }
)

const Chat = mongoose.model('Chat', chatShema);

module.exports = Chat 