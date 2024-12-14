import React, { useEffect } from "react";
import { Link } from "react-router"; // Ensure the correct import for React Router
import UseAuth from "../hooks/UseAuth/UseAuth";
import { AiOutlineMessage } from "react-icons/ai";
import { IoMdLogOut } from "react-icons/io";
import UseAdmin from "../hooks/UseAdmin/UseAdmin";
import { LuLayoutDashboard } from "react-icons/lu";
import { io } from "socket.io-client";

// Initialize the socket connection
const socket = io("http://localhost:3000");

const Navbar = () => {
  const { LogOut, user } = UseAuth();
  console.log(user);
  const [isAdmin, isAdminLoading] = UseAdmin();
  console.log(isAdmin);

  useEffect(() => {
    // Register user with socket when user is available
    if (user) {
      socket.emit("registerUser", user._id);
    }

    // No need to emit "user_logged_out" in cleanup, avoid emitting prematurely.
    return () => {
      // Do not emit "user_logged_out" on unmount or user change
    };
  }, [user]); // Depend on user so the effect runs when user changes

  const handleLogout = async () => {
    try {
      if (user) {
        // Emit the user_logged_out event to the server
        socket.emit("user_logged_out", user._id); // Emit logout event with user ID
      }

      // Call the existing LogOut function to handle session cleanup
      await LogOut();

      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80 lg:max-w-4xl"
    >
      <div className="mx-auto px-4 h-16">
        <div className="flex flex-col lg:flex-row items-center justify-between h-full">
          {/* Logo and Branding */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <AiOutlineMessage className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chat Cove</h1>
            </Link>
          </div>

          {/* User Options */}
          <div className="flex items-center gap-4 ">
            {user ? (
              <>
                {/* Profile Link */}
                <Link
                  to="/profile"
                  className="btn btn-sm gap-2 flex items-center"
                >
                  <img
                    src={user?.photoURL}
                    alt=" "
                    className="h-8 w-auto rounded-xl"
                  />
                </Link>
                {isAdmin && (
                  <Link
                    to="/dashboard"
                    className="btn btn-sm gap-2 flex items-center"
                  >
                    <LuLayoutDashboard className="text-xl" />
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  className="btn btn-sm btn-outline flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <IoMdLogOut className="text-xl" />
                </button>
              </>
            ) : (
              // Placeholder for when the user is not logged in
              <Link to="/login" className="btn btn-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
