import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/chats/ChatBox";
import MyChats from "../components/chats/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { useChatContext } from "../context/chatProvider";

const Chats = () => {
	const [fetchAgain, setFetchAgain] = useState(false);
	const { user } = useChatContext();

	return (
		<div style={{ width: "100%" }}>
			{user && <SideDrawer />}
			<Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="20px">
				{user && <MyChats fetchAgain={fetchAgain} />}
				{user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
			</Box>
		</div>
	);
};

export default Chats;
