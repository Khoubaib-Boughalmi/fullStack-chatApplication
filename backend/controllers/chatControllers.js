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
            return res.status(400).json({message: "get/create new 1to1 chat Err", error: error.message});
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
        return res.status(400).json({message: "get all Current User's Chat Err", error: error.message});
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
        return res.status(400).json({message: "Create GroupChat Err", error: error.message});
    }

}

const renameGroup = async(req, res, _next) => {
    const { newGroupName, groupId } = req.body;
    
    if(!newGroupName || !groupId )
        return res.status(400).json("newGroupName and groupId are required");
    
    try {
        let groupInfo = await Chat.findById(groupId);
        groupInfo = await Chat.populate(groupInfo, {path: "groupAdmin", select: "-password"});
        
        if(!groupInfo.groupAdmin._id.equals(req.user._id))
            return res.status(401).json("Unauthorized: Only group admin can update group name");
        
        groupInfo.chatName = newGroupName;
        groupInfo.save();
        return res.status(200).json(groupInfo);
    } catch (error) {
        return res.status(400).json({message: "Rename Group Err", error: error.message});
    }
}   

module.exports = { getOrCreateOneToOneChat, getAllCurrentUserChats, createGroupChat, renameGroup };