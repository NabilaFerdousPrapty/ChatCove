import React from "react";
import Sidebar from "../Components/SideBar";
import NoChatSelected from "../Components/NoChatSelected";
import Navbar from "../Components/Navbar";
import UseAuth from "../hooks/UseAuth/UseAuth";
import ChatContainer from "../Components/ChatContainer";

const Main = () => {
  const { activeUsers } = UseAuth(); // Access the correct key
  console.log("Active Users:", activeUsers);

  return (
    <div className="h-screen bg-slate-300">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            <div className="flex flex-col w-full h-full justify-center items-center">
              <Navbar />
              {!activeUsers.length ? (
                <NoChatSelected />
              ) : (
                <ChatContainer users={activeUsers} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
