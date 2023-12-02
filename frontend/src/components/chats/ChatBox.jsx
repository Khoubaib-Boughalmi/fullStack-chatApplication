import { Box } from "@chakra-ui/layout";
import SingleChat from "./singleChat";
import { useChatContext } from "../../context/chatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChatContext();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3} 
      bg="white"
      w={{ base: "100%", md: "74%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain= {fetchAgain} setFetchAgain= {setFetchAgain}/>
    </Box>
  );
};

export default Chatbox;