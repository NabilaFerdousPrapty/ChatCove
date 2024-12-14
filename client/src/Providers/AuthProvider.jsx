import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { createContext } from "react";
import UseAxiosCommon from "./../hooks/UseAxiosCommon/UseAxiosCommon";
import auth from "../../Firebase/Firebase.config";
import { io } from "socket.io-client";

export const AuthContext = createContext(null);

// Replace this URL with your backend server's socket.io URL
const socket = io("http://localhost:3000", {
  autoConnect: false, // Prevent auto-connection
});

const AuthProvider = ({ children }) => {
  const axiosCommon = UseAxiosCommon();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);
  const googleProvider = new GoogleAuthProvider();

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const signInWithEmail = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const LogOut = () => {
    setLoading(true);
    if (user) {
      socket.emit("user_logged_out", user.uid); // Inform the backend
    }
    return signOut(auth).finally(() => {
      setUser(null);
      setLoading(false);
    });
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  useEffect(() => {
    // Handle auth state changes
    const unsubscribed = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);

       
        socket.connect();
        socket.emit("login", {
          uid: currentUser.uid,
          email: currentUser.email,
        });
      } else {
        setUser(null);
        setLoading(false);

        // Disconnect the socket if the user logs out
        if (socket.connected) {
          socket.disconnect();
        }
      }
    });

    // Listen for updates on active users
    socket.on("activeUsers", (users) => {
      setActiveUsers(users);
    });

    return () => {
      unsubscribed();
      if (socket.connected) {
        socket.disconnect(); // Clean up socket connection
      }
    };
  }, [axiosCommon]);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    activeUsers, // Active users list
    signInWithGoogle,
    createUser,
    signInWithEmail,
    LogOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
