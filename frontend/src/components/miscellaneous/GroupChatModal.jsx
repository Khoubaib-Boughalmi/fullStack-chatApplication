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
FormControl,
Input,
useToast,
Box,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useChatContext } from "../../context/chatProvider";
import  UserListItem  from "../user/UserListItem"

const GroupChatModal = ({ children }) => {
const { isOpen, onOpen, onClose } = useDisclosure();
const [groupChatName, setGroupChatName] = useState();
const [selectedUsers, setSelectedUsers] = useState([]);
const [search, setSearch] = useState("");
const [searchResult, setSearchResult] = useState([]);
const [loading, setLoading] = useState(false);
const toast = useToast();

const { user, chats, setChats } = useChatContext();

const handleSubmitFn = () => {}

const handleAddUserFn = () => {}

const handleSearchFn = async(value) => {
	value = value.trim();
	if(!value)
		return ;

	const config = {
		headers: {
			Authorization: `Bearer ${user.token}`
		}
	}
	try {
		setLoading(true);
		const {data} = await axios.get(`http://localhost:8080/api/user?search=${value}`, config);
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
		})	}
	setLoading(false);
}

return (
	<>
		<span onClick={onOpen}>{children}</span>

		<Modal onClose={onClose} isOpen={isOpen} isCentered>
		<ModalOverlay />
		<ModalContent>
			<ModalHeader
			fontSize="35px"
			fontFamily="Work sans"
			display="flex"
			justifyContent="center"
			>
			Create Group Chat
			</ModalHeader>
			<ModalCloseButton />
			<ModalBody display="flex" flexDir="column" alignItems="center">
			<FormControl>
				<Input
				placeholder="Chat Name"
				mb={3}
				onChange={(e) => setGroupChatName(e.target.value)}
				/>
			</FormControl>
			<FormControl>
				<Input
				placeholder="Add Users eg: John, Piyush, Jane"
				mb={1}
				onChange={(e) => handleSearchFn(e.target.value)}
				/>
			</FormControl>
				{
					loading ?
					<span>loading...</span>
					:
					searchResult?.slice(0, 4).map((user) => 
					<UserListItem  key={user._id} user={user} handleFunction={handleAddUserFn}/>
				)}
			</ModalBody>
			<ModalFooter>
			<Button onClick={handleSubmitFn} colorScheme="blue">
				Create Chat
			</Button>
			</ModalFooter>
		</ModalContent>
		</Modal>
	</>
	);
};

export default GroupChatModal;