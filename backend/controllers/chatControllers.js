const Chat = require("../models/chatModel");

/*  create a 1 to 1 chat between current user and specified user if it doesnt
    already exists otherwise return the existing chat
*/

const getOrCreateOneToOneChat = async(req, res, _next) => {
    const { userId } = req.body;

    if (!userId) {
        res.status(400).json("userId is required");
    }
    let chat = await Chat.find({'users' : {$all: [userId, req.user._id]}})
                .populate("users", "-password")
                .populate("lastMessage");
    chat = await Chat.populate(chat, {path: "lastMessage.sender", select: "name avatar email"});

    if(chat.length) {
        res.send(chat[0]);
    } else {
        const newChatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        };

        try {
            const createdChat = await Chat.create(newChatData);
            const populatedChat = await Chat.populate(createdChat, {path: "users", select: "-password"});
            res.status(200).json(populatedChat);
        } catch (error) {
            res.status(400).json(error);
        }
    }
}

/* fetch current user's chats */

const getAllCurrentUserChats = async(req, res, _next) => {
    try {
        const allChats = await Chat.find({users: req.user._id})
                        .populate("users", "-pasasword")
                        .populate("groupAdmin", "-pasasword") //if group chat
                        .populate("lastMessage")
                        .sort({updatedAt: -1})

        return res.status(200).json(allChats);
    } catch (error) {
        console.log(error);
        return res.status(400).json({error});
    }
}

const createGroupChat = async(req, res, _next) => {
    const { groupUsers, groupName } = req.body;
    if(!groupUsers || !groupName)
        return res.status(400).json("Please provide at least 3 users and a valid group name");
        
    const users = JSON.parse(groupUsers);
    if(users.length < 3) //2 or less
        return res.status(400).json("Please provide at least 3 users");
    users.push(req.user._id);

    const newGroupChatData = {
        chatName: groupName,
        isGroupChat: true,
        users: users,
        groupAdmin: req.user._id
    }
    
    try {
        const newGroupChat = await Chat.create(newGroupChatData);
        const populatedNewGroupChat = await Chat.populate(newGroupChat, 
                                    {path: "users", select: "-password"},
                                    {path: "groupAdmin", select: "-password"});
        console.log(populatedNewGroupChat);
        return res.status(200).json(populatedNewGroupChat);
    } catch (error) {
        return res.status(400).json(error);
    }

}

module.exports = { getOrCreateOneToOneChat, getAllCurrentUserChats, createGroupChat };