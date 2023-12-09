export const updateLastMessage = (chats, setChats, newMessage) => {
    for (let index = 0; index < chats.length; index++) {
        if (chats[index]._id == newMessage?.chatId._id) {
            console.log("old: ", chats[index].lastMessage);
            chats[index].lastMessage = newMessage;
            console.log("new: ", chats[index].lastMessage);
            setChats([...chats]);
        }
    }
}

