import React from 'react'
import Sidebar from '../Components/SideBar';
import NoChatSelected from '../Components/NoChatSelected';

const Main = () => {
    const user = null;
  return (
    <div className="h-screen bg-slate-300 ">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden ">
            <Sidebar />

            {!user ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main