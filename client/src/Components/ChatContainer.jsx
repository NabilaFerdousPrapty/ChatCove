import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import UseAxiosCommon from "./../hooks/UseAxiosCommon/UseAxiosCommon";
import { useQuery } from "@tanstack/react-query";

// Make sure to use your backend server's URL
const socket = io("http://localhost:3000");

const ChatContainer = ({ user, activeUser }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const axiosCommon = UseAxiosCommon();

  useEffect(() => {
    // Register the user on connect
    socket.emit("registerUser", user._id);

    // Fetch chat history on component load
    const fetchMessages = async () => {
      try {
        const response = await axiosCommon.get(
          `/chats/${user.email}/${activeUser.email}`
        );
        setMessages(response.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      // Only add the message if it is for the current conversation
      if (
        (message.senderId === user._id &&
          message.receiverId === activeUser._id) ||
        (message.senderId === activeUser._id && message.receiverId === user._id)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [user, activeUser]);

  const handleSendMessage = async () => {
    if (!content.trim()) return;

    const message = {
      sender: user.email,
      receiver: activeUser.email,
      messages: content,
      fileURL:'',
    };

    try {
      // Save message to backend
      await axiosCommon.post("/chats", message);

      // Emit the message to the socket server
      socket.emit("sendMessage", message);

      // Optimistically update UI
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, timestamp: new Date() },
      ]);
      setContent("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };
  const {
    data: messageData = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messages"], // Include searchTag in queryKey
    queryFn: async () => {
      const { data } = await axiosCommon.get(
        `/chats/${user.email}/${activeUser.email}`
      );
      return data;
    },
  });
console.log(messageData);


  return (
    <div className="flex flex-col w-full h-full">
      <h2 className="text-xl font-semibold">Chat with {activeUser.email}</h2>

      <div className="flex flex-col flex-grow overflow-auto p-4 bg-gray-100">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="p-2 bg-white rounded-lg shadow-sm">
              <p className="font-semibold">
                {msg.senderId === user._id ? "You" : activeUser.email}
              </p>
              <p>{msg.content}</p>
              <span className="text-sm text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center p-4 bg-white border-t">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
