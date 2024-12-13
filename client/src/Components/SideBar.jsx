import { useEffect, useState } from "react";
import { FaHome, FaUser, FaTicketAlt, FaCog } from "react-icons/fa";
import io from "socket.io-client";

const Sidebar = () => {
//   const [activeUsers, setActiveUsers] = useState([]);
//   const socket = io("http://localhost:3000"); 

//   useEffect(() => {

//     socket.emit("active_users");

    
//     socket.on("active_users", (users) => {
//       setActiveUsers(users);
//     });

//     // Cleanup the socket connection when the component unmounts
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto border-r rtl:border-r-0 rtl:border-l">
      <a href="#" className="mx-auto">
        <img
          className="w-auto h-6 sm:h-7"
          src="https://merakiui.com/images/full-logo.svg"
          alt="Logo"
        />
      </a>

      <div className="flex flex-col items-center mt-6 -mx-2">
        <img
          className="object-cover w-24 h-24 mx-2 rounded-full"
          src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
          alt="avatar"
        />
        <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">
          John Doe
        </h4>
        <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
          john@example.com
        </p>
      </div>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Active Users
        </h5>
        <ul className="space-y-2">
          {/* {activeUsers.length > 0 ? (
            activeUsers.map((user, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {user}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-600 dark:text-gray-400">
              No active users
            </li>
          )} */}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
