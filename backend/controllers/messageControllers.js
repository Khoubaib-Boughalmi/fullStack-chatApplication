const Chat = require("../models/chatModel");
const { Message } = require("../models/messageModel");

const sendMessage = async (req, res) => {
    const { chatId, content } = req.body;
    if (!chatId || !content) {
        return res.status(400).json({ message: "chatId and Content are required" });
    }
    try {
        const newMessage = {
            senderId: req.user?._id,
            chatId: chatId,
            content: content,
        }
        let message = await Message.create(newMessage);
        message = await Message.populate(message,
            { path: "senderId", select: "-password" },
            );

        message = await Message.populate(message, { path: "chatId", select: "" });
        message = await Message.populate(message, {path: "chatId.users", select: "name email avatar"});

        const updateLatestMsg = await Chat.findByIdAndUpdate(message?.chatId?._id, {lastMessage: message}) 
        res.status(200).json(message);
    } catch (error) {
        return res.status(400).json({ message: "Send Message Err", error: error.message });
    }
}

module.exports = { sendMessage };