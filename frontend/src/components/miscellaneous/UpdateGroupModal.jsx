import { useState, useEffect } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import axios from "axios";
import UserBadgeItem from ".././user/UserBadgeItem"
import { useChatContext } from "../../context/chatProvider"

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    IconButton,
    FormControl,
    Input,
    Box,
    useToast,
    Text,
    Image,
} from "@chakra-ui/react";
import UserListItem from "../user/UserListItem";

const UpdateGroupModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [search, setSearch] = useState("");
    const [newGroupName, setNewGroupName] = useState("");
    const [loading, setLoading] = useState("");

    const { user, setSelectedChat, selectedChat, chats, setChats } = useChatContext();
    const toast = useToast();

    const handleAddUserFn = (userToAdd) => {
        for (let index = 0; index < selectedUsers.length; index++) {
            if (selectedUsers[index]._id == userToAdd._id) {
                setSearchResult([]);
                return toast({
                    title: `User already added`,
                    description: "Please provide a different user",
                    status: 'warning',
                    duration: 1000,
                    isClosable: true,
                    position: "top-right"
                })
            }
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
        setSearchResult([]);
        setSearch("");
    }

    const handleSearchFn = async (value) => {
        setSearch(value);
        value = value.trim();

        if (!value) {
            setSearchResult([]);
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:8080/api/user?search=${value}`, config);
            setSearchResult(data);
            console.log(searchResult);
        } catch (error) {
            setSearchResult([]);
            toast({
                title: `No User with name or email: ${value}`,
                description: "Please provide a valid name or email",
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: "top-right"
            })
        }
        setLoading(false);
    }

    const handleRemoveUserFn = (user) => {
        setSelectedUsers(selectedUsers.filter((u) => (u._id !== user._id)))
    }
    const handleUpdateNameFn = async () => {
        setNewGroupName(newGroupName.trim.length);
        if (newGroupName) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
                const { data } = await axios.put(
                    "http://localhost:8080/api/chat/group",
                    {
                        newGroupName: newGroupName,
                        groupId: selectedChat._id
                    },
                    config
                );
                let tmpChats = chats.filter((chat) => (chat._id !== data._id));
                setChats([data, ...tmpChats]);
                setSelectedChat(data);
            } catch (error) {
                console.log(error);
            }
        }
        setNewGroupName("");
    }

    const handleUpdateGroupMembersFn = async() => {
        let usersIds = [];

        selectedUsers.map((user) => {
            usersIds.push(user._id);
        })

        if(usersIds.length < 2) {
            return toast({
                title: `Group must have at least 3 members`,
                description: "At least 3 users per group",
                status: 'error',
                duration: 1000,
                isClosable: true,
                position: "top-right"
            })
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            usersIds = JSON.stringify(usersIds);
            console.log(usersIds);
            const { data } = await axios.put(
                "http://localhost:8080/api/chat/group/members",
                {
                    usersIds: usersIds,
                    groupId: selectedChat._id
                },
                config
            );
            let tmpChats = chats.filter((chat) => (chat._id !== data._id));
            setChats([data, ...tmpChats]);
            setSelectedChat(data);
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleSubmitFn = async () => {
        handleUpdateNameFn();
        handleUpdateGroupMembersFn();
        onClose();
    }

    useEffect(() => {
        setSelectedUsers(selectedChat.users);
    }, [])

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            )}
            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent minH="410px">
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="start"
                    >
                        <Box w="100%" display="flex" justifyContent="center">
                            {selectedUsers?.map((user) => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleRemoveUserFn(user)}
                                />
                            ))}
                        </Box>
                        <FormControl>
                            <Input
                                placeholder="Update Group Name"
                                mb={1}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                value={newGroupName}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users eg: John, Piyush, Jane"
                                mb={1}
                                value={search}
                                onChange={(e) => handleSearchFn(e.target.value)}
                            />
                        </FormControl>
                        <Box w="100%">
                            {
                                loading ?
                                    <span>loading...</span>
                                    :
                                    searchResult.length ?
                                        (searchResult?.slice(0, 4).map((user) =>
                                            <UserListItem key={user._id} user={user} handleFunction={() => handleAddUserFn(user)} />))
                                        : ""
                            }
                        </Box>
                    </ModalBody>
                    <ModalFooter display="flex">
                        <Button style={{ marginRight: "10px" }} bgColor="green" textColor="white" _hover="" onClick={handleSubmitFn}>Submit</Button>
                        <Button bgColor="red" textColor="white" _hover="" onClick={handleSubmitFn}>Leave Group</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UpdateGroupModal;
