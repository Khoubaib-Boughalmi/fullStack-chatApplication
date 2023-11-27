import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


const ChatContext = createContext();

export const ChatProvider = ({children}) => {
    const [selectedChats, setSelectedChats] = useState();
    const [chats, setChats] = useState();
    const navigate = useNavigate();
    let user = JSON.parse(localStorage.getItem("userInfo"));
    useEffect(() => {
        if(!user) {
            navigate("/");
        }
    }, [navigate]);
    
    return (
        <ChatContext.Provider value={{user, selectedChats, setSelectedChats, chats, setChats}} > {children} </ChatContext.Provider>
    )
}

export const useChatContext = () => {
    return useContext(ChatContext);
}

