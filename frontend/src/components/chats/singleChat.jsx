import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender } from "../../helpers/getSender";
import io from "socket.io-client";
import { updateLastMessage } from "../../helpers/updateLastMsgChatList";
import { useChatContext } from "../../context/chatProvider";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateGroupModal from "../miscellaneous/UpdateGroupModal";

const ENDPOINT = `http://localhost:8080`; // "https://test.herokuapp.com"; -> After deployment
let socket;

import { MainContainer, ChatContainer, MessageList, Message, MessageGroup, Avatar, MessageInput } from '@chatscope/chat-ui-kit-react';


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [socketConnected, setSocketConnected] = useState(false);
	const [selectedChatComapre, setSelectedChatComapre] = useState(false);
	const [typing, setTyping] = useState(false);
	const [istyping, setIsTyping] = useState(false);
	const toast = useToast();


	const { selectedChat, setSelectedChat, user, chats, setChats, notification, setNotification } = useChatContext();

	const typingHandlerFn = (e) => {
		setNewMessage(e.target.value);
	}

	const isLastMessage = (messages, message) => {
		for (let index = 0; index < messages.length; index++) {
			if (index == messages.length - 1)
				return (1);
			if (messages[index]._id == message._id) {
				if ((messages[index + 1]?.senderId?._id != message?.senderId?._id) || (messages[index + 1]?.chatId?._id != message?.chatId?._id)) {
					return (1);
				}
				else return (0);
			}
		}
		return (1);
	}

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit("setup", user);
		socket.on("connection", () => {
			setSocketConnected(true);
		});

	}, [])

	useEffect(() => {
		socket.on("message received", (newMessage) => {
			setMessages([...messages, newMessage]);
			//from newMessage chatId look for the chat that corresponds to it in chats object and update the last message id with the new 
			updateLastMessage(chats, setChats, newMessage)
		})
	})

	const fetchCurrentChatMessages = async () => {
		if (!selectedChat) return;
		console.log("i changed here");
		setLoading(true);
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}
			const { data } = await axios.get(`http://localhost:8080/api/message/${selectedChat._id}`, config);
			// if(!data.length) setMessages([]);
			// else
			socket.emit("join room", selectedChat._id);
			// if(messages.length)
			// 	setMessages([...messages, ...data]);
			// else
			setMessages(data);
		} catch (error) {
			// setMessages([]);
			console.log(error);
			toast({
				title: "Unable to fetch message",
				description: "Please try again",
				status: 'error',
				duration: 1000,
				isClosable: true,
				position: "top-right"
			})
		}
		setLoading(false);
	}

	const sendMessageFn = async (e) => {
		if (newMessage.trim() == "")
			return;
		if (!newMessage || e.key !== "Enter")
			return;
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}
			setNewMessage("");
			const { data } = await axios.post(
				`http://localhost:8080/api/message`,
				{
					"chatId": selectedChat._id,
					"content": newMessage
				},
				config
			);
			setMessages([...messages, data]);
			// socket.emit("new message", (data) => {
			// 	setMessages([...messages, data]);
			// 	//from data chatId look for the chat that corresponds to it in chats object and update the last message id with the new 
			updateLastMessage(chats, setChats, data)
			socket.emit("new message", data);
		} catch (error) {
			console.log(error);
			toast({
				title: "Unable to send message",
				description: "Please try again",
				status: 'error',
				duration: 1000,
				isClosable: true,
				position: "top-right"
			})
		}
		setNewMessage("");
	}

	useEffect(() => {
		// setMessages([""]);
		fetchCurrentChatMessages();
		console.log("i  was hheeeeree");
		// selectedChatComapre = selectedChat;
	}, [selectedChat])

	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: "28px", md: "30px" }}
						pb={3}
						px={2}
						w="100%"
						fontFamily="Work sans"
						display="flex"
						justifyContent={{ base: "space-between" }}
						alignItems="center"
					>
						<IconButton
							display={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat("")}
						/>
						{
							selectedChat?.isGroupChat ?
								(
									<>
										<span>{selectedChat?.chatName.toUpperCase()}</span>
										<UpdateGroupModal />

									</>
								) : (
									<>
										<span>{getSender(user._id, selectedChat?.users)?.name.toUpperCase()}</span>
										<ProfileModal user={getSender(user._id, selectedChat?.users)} />
									</>
								)
						}
					</Text>
					<Box
						display="flex"
						flexDir="column"
						justifyContent="flex-end"
						bg="#E8E8E8"
						w="100%"
						h="100%"
						borderRadius="lg"
						overflow="hidden"
						background="transparent"
					>
						{loading ? (
							<Spinner
								size="xl"
								w={20}
								h={20}
								alignSelf="center"
								margin="auto"
							/>
						) : (

							<div style={{ position: "relative", height: "fit-content", overflowY: "scroll", width: "102%", paddingRight: "1rem" }}>
								<MainContainer style={{ border: "none" }}>
									<ChatContainer>
										<MessageList>
											{messages?.map((message) => (
												message.chatId?._id === selectedChat?._id ? (
													message.senderId?._id === user._id ? (
														<Message
															model={{
																direction: "outgoing",
																message: message.content,
																sentTime: "just now",
																sender: message.senderId?.name
															}}
														/>
													) : (
														isLastMessage(messages, message) ? (
															<Message
																model={{
																	direction: "incoming",
																	message: message.content,
																	sentTime: "just now",
																	sender: message.senderId?.name
																}}
																style={{ marginBottom: "20px" }}
															>
																<Avatar src={message.senderId?.avatar} style={{}} />
															</Message>) : (
															<Message
																model={{
																	direction: "incoming",
																	message: message.content,
																	sentTime: "just now",
																	sender: message.senderId?.name
																}}
															>
																<Avatar src={message.senderId?.avatar} style={{ display: "none" }} />
															</Message>
														)

													)
												) : ""
											))}

										</MessageList>
										{/* <MessageInput placeholder="Type message here" /> */}
									</ChatContainer>
								</MainContainer>
							</div>
						)}

						<div
							onKeyDown={sendMessageFn}
							id="first-name"
							isRequired
						>
							{istyping ? (
								<div>
									{/* <Lottie
										options={""}
										// height={50}
										width={70}
										style={{ marginBottom: 15, marginLeft: 0 }}
									/> */}
								</div>
							) : (
								<></>
							)}
							<Input
								variant="filled"
								bg="#E0E0E0"
								placeholder="Enter a message.."
								onChange={typingHandlerFn}
								value={newMessage}
							/>
						</div>
					</Box>
				</>
			) : (
				<Box display="flex" alignItems="center" justifyContent="center" h="100%">
					<Text fontSize="3xl" pb={3} fontFamily="Work sans">
						Click on a user to start chatting
					</Text>
				</Box>
			)
			}
		</>
	);
};

export default SingleChat;