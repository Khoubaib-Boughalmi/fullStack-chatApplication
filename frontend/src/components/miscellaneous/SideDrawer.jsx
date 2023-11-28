import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import {
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
} from "@chakra-ui/menu";
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { useChatContext } from "../../context/chatProvider";
import { ChatListLoading } from "../chats/ChatListLoading";
import ProfileModal from "../miscellaneous/profileModel"
import UserListItem from "../user/UserListItem";

function SideDrawer() {
	const { user, selectedChat, setSelectedChat, chats, setChats } = useChatContext();
	const navigate = useNavigate();

	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);

	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleLogoutFn = () => {
		localStorage.removeItem("userInfo");
		navigate("/");
	}

	const handleSearchFn = async() => {
		if(!search) {
			return toast({
				title: "Please provide a User name",
				description: "can't search an empty user",
				status: 'warning',
				duration: 2000,
				isClosable: true,
				position: "top-right"
			})
		}
		setLoading(true);
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}
			const { data } = await axios.get(`http://localhost:8080/api/user/?search=${search}`, config);
			setSearchResult(data);
		} catch (error) {
			setSearchResult([]);
			toast({
				title: "Couldn't find any user with the provided data",
				description: "Please provide a valid user",
				status: 'warning',
				duration: 2000,
				isClosable: true,
				position: "top-right"
			})
		}
		setLoading(false);
	}

	const accessChatFn = async(userId) => {
		const config = {
			headers: {
				"Content-type": "application/json", 
				Authorization: `Bearer: ${user.token}`
			}
		}
		setLoadingChat(true);
		try {
			const { data } = await axios.post("http://localhost:8080/api/chat", {userId}, config);

			if(!chats.find((chat) => {chat._id === data._id})) //add the current selected chat to the global chat UI
				setChats([data, ...chats]);

			setSelectedChat(data);
			setLoadingChat(false);
			onClose();
		} catch (error) {
			toast({
				title: "Invalid Chat",
				description: "Please provide a valid user",
				status: 'warning',
				duration: 2000,
				isClosable: true,
				position: "top-right"
			})
		}
	}

	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				bg="white"
				w="100%"
				p="5px 10px 5px 10px"
				borderWidth="5px"
			>
				<Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
				<Button variant="ghost" onClick={onOpen}>
					<i className="fas fa-search"></i>
					<Text display={{ base: "none", md: "flex" }} px={4}>
					Search User
					</Text>
				</Button>
				</Tooltip>
				<Text fontSize="2xl" fontFamily="Work sans">
				Pre-Transcendence
				</Text>
				<div>
					<Menu>
						<MenuButton p={1}>
						
						<BellIcon fontSize="2xl" m={1} />
						</MenuButton>
						<MenuList pl={2}>Hello world</MenuList>
					</Menu>
					<Menu>
					<MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
					<Avatar
						size="sm"
						cursor="pointer"
						name={user.name}
						src={user.avatar}
					/>
					</MenuButton>
					<MenuList>

					<ProfileModal user={user}>
						<MenuItem>My Profile</MenuItem>{" "}
					</ProfileModal>
					<MenuDivider />
					<MenuItem onClick={handleLogoutFn}>Logout</MenuItem>
					</MenuList>
				</Menu>
				</div>
			</Box>

			<Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearchFn}>Go</Button> 
            </Box>
            {loading ? (
				<ChatListLoading />
			) : (
				searchResult?.map((user) => (
					<UserListItem
					key={user._id}
					user={user}
					handleFunction={() => accessChatFn(user._id)}
					/>
				))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
	</>
	);
}

export default SideDrawer;
