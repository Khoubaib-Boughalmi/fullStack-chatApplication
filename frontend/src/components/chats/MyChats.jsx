import { useEffect, useState } from "react";
import { getSender } from "../../helpers/getSender";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { Button } from "@chakra-ui/react";
import { ChatListLoading } from "./ChatListLoading";
import { Avatar } from "@chakra-ui/avatar";


import { useChatContext } from "../../context/chatProvider"
import axios from 'axios';
import GroupChatModal from "../miscellaneous/GroupChatModal";

const MyChats = () => {
  const { user, selectedChat, setSelectedChat, chats, setChats  } = useChatContext();

  const getCurrentUsersChat = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
    try {
      const { data } = await axios.get("http://localhost:8080/api/chat", config);
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {

    getCurrentUsersChat();
  }, [])
  
  return (
    <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{ base: "100%", md: "31%" }}
    borderRadius="lg"
    borderWidth="1px"
  >
    <Box
      pb={3}
      px={3}
      fontSize={{ base: "28px", md: "30px" }}
      fontFamily="Work sans"
      display="flex"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
    >
      My Chats
      <GroupChatModal>
        <Button
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
      </GroupChatModal>
    </Box>
    <Box
      display="flex"
      flexDir="column"
      p={3}
      bg="#F8F8F8"
      w="100%"
      h="100%"
      borderRadius="lg"
      overflowY="hidden"
    >
      {chats ? (
        <Stack overflowY="scroll">
          {chats.map((chat) => (
            <Box
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedChat === chat._id ? "#38B2AC" : "#E8E8E8"}
              color={selectedChat === chat._id ? "white" : "black"}
              px={3}
              py={2}
              borderRadius="lg"
              key={chat._id}
              display="flex"
              alignItems="center"
            >
              <Avatar
                mr={4}
                size="sm"
                cursor="pointer"
                src={getSender(user._id, chat.users).avatar}
              />
              <Text fontWeight="bold">
                {!chat.isGroupChat
                  ? getSender(user._id, chat.users).name
                  : chat.chatName}
              </Text>
            </Box>
          ))}
        </Stack>
      ) : (
        <ChatListLoading />
      )}
    </Box>
  </Box>
  )
}

export default MyChats
