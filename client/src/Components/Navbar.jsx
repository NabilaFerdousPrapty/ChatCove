import { Link } from "react-router";
import UseAuth from "../hooks/UseAuth/UseAuth";
import { FaUser } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { IoMdLogOut } from "react-icons/io";

const Navbar = () => {
  const {  LogOut, user } = UseAuth();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80 max-w-4xl"
    >
      <div className=" mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
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
                  <FaUser className="text-xl" />
                 
                </Link>

                {/* Logout Button */}
                <button
                  className="btn btn-sm btn-outline flex items-center gap-2"
                  onClick={()=> LogOut()}
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
