import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({children}) => {
    let user = JSON.parse(localStorage.getItem("userInfo"));

    return (
        <ChatContext.Provider value={{user}} > {children} </ChatContext.Provider>
    )
}

export const useChatContext = () => {
    return useContext(ChatContext);
}

