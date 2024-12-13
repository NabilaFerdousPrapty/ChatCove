import { useState } from "react";
import UseAxiosCommon from "../hooks/UseAxiosCommon/UseAxiosCommon";

const Sidebar = ({ activeUsers, onUserClick, currentUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]); // Ensure users is initialized as an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const axiosCommon = UseAxiosCommon();
  console.log(activeUsers);

  // Handle user search
  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setUsers([]); // Clear results if search is empty
      return;
    }
    axiosCommon
      .get(`/users/search/${searchQuery}`)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      });
    setLoading(true);
  };


  // Filter out the current user from the active users list
  const filteredActiveUsers = activeUsers.filter(
    (user) => user.email !== currentUser.email
  );

  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto border-r rtl:border-r-0 rtl:border-l border-blue-200 border-2 rounded-3xl">
      <a href="#" className="mx-auto">
        <img
          className="w-auto h-20 bg-gray-600 p-5 rounded-2xl"
          src="https://i.ibb.co/com/ScVh51f/logo1-removebg-preview.png"
          alt="Logo"
        />
      </a>

      <div className="flex flex-col flex-1 mt-6">
        <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Search Users
        </h5>

        {/* Search Input */}
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(); // Trigger search on Enter key
            }
          }}
        />

        {/* Show loading */}
        {loading && <div className="mt-2 text-gray-500">Loading...</div>}

        {/* Show error */}
        {error && <div className="mt-2 text-red-500">{error}</div>}

        {/* Show search results */}
        <ul className="space-y-2 mt-4">
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <li className="my-4" key={user._id}>
                <a
                  
                  className="text-blue-500 hover:text-blue-700 bg-slate-300 hover:bg-slate-400 px-3 py-2 rounded-lg"
                  onClick={() => alert(`Clicked on ${user.name}`)} // Handle click for user
                >
                  {user.name}
                </a>
              </li>
            ))
          ) : (
            <div className="text-gray-500">No users found.</div>
          )}
        </ul>

        <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Active Users
        </h5>
        <ul className="space-y-2 mt-4">
          {filteredActiveUsers?.length > 0 ? (
            filteredActiveUsers?.map((active_user) => (
              <li className="my-4" key={active_user._id}>
                <a
                  
                  className="text-blue-500 hover:text-blue-700 bg-slate-300 hover:bg-slate-400 px-3 py-2 rounded-lg"
                  onClick={() => onUserClick(active_user)} // Pass clicked user to onUserClick
                >
                  {active_user.email}
                </a>
              </li>
            ))
          ) : (
            <div className="text-gray-500">No active users found.</div>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
