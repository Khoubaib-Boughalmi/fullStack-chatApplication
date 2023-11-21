import React, { useEffect, useState } from 'react'
import axios from "axios"

export const Chats = () => {
	const [chats, setChats] = useState([]);
	const fetchData = async() => {
		const { data } = await axios.get("http://localhost:8080/api/chats");
		console.log(data);
		setChats(data);
	}
  	useEffect(() => {
		  fetchData();
		  console.log(chats);
	}, []);
	return (
		<div>
			{chats.length ? chats.map(chat => (<div key={chat._id}>{chat.chatName}</div>)) : "No chat available"}
		</div>
  )
}

