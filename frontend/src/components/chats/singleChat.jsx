import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender } from "../../helpers/getSender";
import { io } from "socket.io-client";

import { useChatContext } from "../../context/chatProvider";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateGroupModal from "../miscellaneous/UpdateGroupModal";

const ENDPOINT = "http://localhost:8080"; // "https://test.herokuapp.com"; -> After deployment
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


	const { selectedChat, setSelectedChat, user, notification, setNotification } = useChatContext();

	const typingHandlerFn = (e) => {
		setNewMessage(e.target.value);
	}

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit("setup", user);
		socket.on("connection",() => {
			setSocketConnected(true);
		});

	}, [])

	useEffect(() => {
		socket.on("message received", (newMessage)=> {
			if(newMessage._id == selectedChat.chat._id) //user currently has chat opened
				setMessages([...messages, newMessage]);
		})
	})

	const fetchCurrentChatMessages = async () => {
		if (!selectedChat) return;
		setLoading(true);
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}
			const { data } = await axios.get(`http://localhost:8080/api/message/${selectedChat._id}`, config);
			setMessages(data);
			socket.emit("join room", selectedChat._id);
		} catch (error) {
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
				"http://localhost:8080/api/message",
				{
					"chatId": selectedChat._id,
					"content": newMessage
				},
				config
			);
			socket.emit("new message", data);
			setMessages([...messages, data]);
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
		fetchCurrentChatMessages();
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
						overflowY="hidden"
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

							<div style={{ position: "relative", height: "fit-content", overflow: "hidden", width: "100%" }}>
								<MainContainer style={{ border: "none" }}>
									<ChatContainer >
										<MessageList>
											{messages?.map((message) => (
												message.senderId?._id == user._id ?
													(
														<Message model={{
															direction: "outgoing",
															message: message.content,
															sentTime: "just now",
															sender: message.senderId?.name
														}} />
													)
													:
													(
														<Message model={{
															direction: "incoming",
															message: message.content,
															sentTime: "just now",
															sender: message.senderId?.name
														}} />
													)
												))
											}
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
			)}
		</>
	);
};

export default SingleChat;