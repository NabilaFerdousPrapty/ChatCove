import React from "react";

const ChatContainer = ({ user }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <h2 className="text-xl font-semibold">Chat with {user.email}</h2>
      {/* Add your chat interface here */}
      <div>Chat interface will be here for {user.email}</div>
    </div>
  );
};

export default ChatContainer;
