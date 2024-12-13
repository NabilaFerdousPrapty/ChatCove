import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import UseAxiosCommon from './../hooks/UseAxiosCommon/UseAxiosCommon';

// Make sure to use your server's URL
const socket = io("http://localhost:3000");

const ChatContainer = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [activeUser, setActiveUser] = useState(user);
  const axiosCommon=UseAxiosCommon();

  useEffect(() => {
    // Register the user on connect
    socket.emit("registerUser", user._id);

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Clean up socket events when the component unmounts
      socket.off("receiveMessage");
    };
  }, [user]);

  const handleSendMessage = () => {
    if (!content.trim()) return; // Don't send empty messages

    const message = {
      senderId: user._id,
      receiverId: activeUser._id, // Assuming you are chatting with this active user
      content,
    };
    axiosCommon.post("/chats",message).then((res)=>{
      console.log(res.data);
    }).catch((err)=>{
      console.log(err);
    });
    

    // Emit the message to the backend to be saved and sent to the receiver
    socket.emit("sendMessage", message);

    // Add the message to local state (optimistic update)
    setMessages((prevMessages) => [...prevMessages, message]);
    setContent(""); // Clear the input field
  };

  return (
    <div className="flex flex-col w-full h-full">
      <h2 className="text-xl font-semibold">Chat with {activeUser.email}</h2>

      <div className="flex flex-col flex-grow overflow-auto p-4 bg-gray-100">
        {/* Display all chat messages */}
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="p-2 bg-white rounded-lg shadow-sm">
              <p className="font-semibold">
                {msg.senderId === user._id ? "You" : activeUser.email}
              </p>
              <p>{msg.content}</p>
              <span className="text-sm text-gray-500">
                {}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
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
