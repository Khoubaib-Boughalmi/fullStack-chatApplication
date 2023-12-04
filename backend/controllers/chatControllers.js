const Chat = require("../models/chatModel");
const ObjectId = require('mongoose').Types.ObjectId;

/*  create a 1 to 1 chat between current user and specified user if it doesnt
    already exists otherwise return the existing chat
*/

const getOrCreateOneToOneChat = async(req, res, _next) => {
    const { userId } = req.body;
    console.log("getOrCreateOneToOneChat");
    if (!userId) {
        res.status(400).json("userId is required");
    }
    let chat = await Chat.find({'users' : {$all: [userId, req.user._id]}, isGroupChat: false})
                .populate("users", "-password")
                .populate("lastMessage");
    chat = await Chat.populate(chat, {path: "lastMessage.senderId", select: "name avatar email"});

    console.log(chat);
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
        let allChats = await Chat.find({users: req.user?._id})
                        .populate("users", "-pasasword")
                        .populate("groupAdmin", "-pasasword") //if group chat
                        .populate("lastMessage")
                        .sort({updatedAt: -1})
        allChats = await Chat.populate(allChats, {path: "lastMessage.senderId", select: "name avatar email"})
        return res.status(200).json(allChats);
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "get all Current User's Chat Err", error: error.message});
    }
}

const createGroup = async(req, res, _next) => {
    const { groupUsers, groupName, groupAvatar } = req.body;
    if(!groupUsers || !groupName || !groupAvatar)
        return res.status(400).json("Please provide at least 3 users and a valid group name");
        
    const users = JSON.parse(groupUsers);
    if(users.length < 2) //2 or less
        return res.status(400).json("Please provide at least 2 users");
    users.push(req.user._id);

    const newGroupChatData = {
        chatName: groupName,
        groupAvatar: groupAvatar,
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
        
        // if(!groupInfo.groupAdmin._id.equals(req.user._id))
        //     return res.status(401).json("Unauthorized: Only group admin can update group name");

        groupInfo.chatName = newGroupName;
        await groupInfo.save();
        return res.status(200).json(groupInfo);
    } catch (error) {
        return res.status(400).json({message: "Rename Group Err", error: error.message});
    }
}

//TO DO: make sure only group members can add a user to the group
//TO DO: check that the added user is a legit user
const updateGroupMembers = async(req, res, _next) => {
    const {usersIds, groupId} = req.body;

    if(!usersIds || !groupId)
        return res.status(400).json({message: "Please Provide groupId and usersIds"});
    try {
        console.log(usersIds);
        const group = await Chat.findById(groupId);
        // const isMember = group.users.some(user => user.equals(userId));
        // if (isMember) {
        //     return res.status(403).json({ message: "User is already a member of the group" });
        // }
        group.users = [];
        let parsedUsersIds = JSON.parse(usersIds);
        parsedUsersIds.map((userId) => {
            group.users.push(new ObjectId(userId));
        })
        await group.save();
        return res.status(200).json(group);
    } catch (error) {
        return res.status(400).json({message: "Add new User to Group Err", error: error.message});
    }
}

const removeUserFromGroup = async(req, res, _next) => {
    const {userId, groupId} = req.body;
    
    if(!userId || !groupId)
        return res.status(400).json({message: "Please Provide groupId and userId"});

    try {
        const group = await Chat.findById(groupId);
        const isMember = group.users.some(user => user.equals(userId));
        if (!isMember) {
            return res.status(403).json({ message: "can't remove user: User is Not a member of the group" });
        }
        group.users = group.users.filter(item => !item.equals(userId));
        await group.save();
        return res.status(200).json(group);
    } catch (error) {
        return res.status(400).json({message: "Remove User From Group Err", error: error.message});
    }

}

module.exports = {
    getOrCreateOneToOneChat,
    getAllCurrentUserChats,
    createGroup,
    renameGroup,
    updateGroupMembers,
    removeUserFromGroup
};