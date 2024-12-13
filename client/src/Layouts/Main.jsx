import React, { useState } from "react";
import Sidebar from "../Components/SideBar";
import NoChatSelected from "../Components/NoChatSelected";
import Navbar from "../Components/Navbar";
import UseAuth from "../hooks/UseAuth/UseAuth";
import ChatContainer from "../Components/ChatContainer";

const Main = () => {
  const { activeUsers } = UseAuth(); // Access active users from context
  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user
  console.log("Active Users:", activeUsers);
const { user } = UseAuth(); // Access current user from context
  const currentUser = user; // Set current user from context

  const handleUserClick = (user) => {
    setSelectedUser(user); // Set selected user when an active user is clicked
  };

  return (
    <div className="h-screen bg-slate-300">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar currentUser={currentUser} activeUsers={activeUsers} onUserClick={handleUserClick} />{" "}
            {/* Pass handleUserClick */}
            <div className="flex flex-col w-full h-full justify-center items-center">
              <Navbar />
              {selectedUser ? (
                <ChatContainer user={selectedUser} /> // Show ChatContainer when user is selected
              ) : (
                <NoChatSelected /> // Show NoChatSelected when no user is selected
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
