import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import UseAxiosCommon from './../hooks/UseAxiosCommon/UseAxiosCommon';
import auth from '../../Firebase/Firebase.config';




export const AuthContext=createContext(null)

const AuthProvider = ({children}) => {
  const axiosCommon=UseAxiosCommon();
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  const googleProvider = new GoogleAuthProvider();
  const createUser=(email,password)=>{
   return createUserWithEmailAndPassword(auth, email, password)
  }
  const signInWithGoogle =  () => {
    setLoading(true)
    return signInWithPopup(auth, googleProvider)
  }
  const signInWithEmail=(email,password)=>{
    setLoading(true)
    return signInWithEmailAndPassword(auth,email,password)
  }
  const LogOut=()=>{
    setLoading(true)
   return signOut(auth)
  }
  const updateUserProfile=(name,photo)=>{
   return updateProfile(auth.currentUser,{
      displayName:name,
      photoURL:photo
    })
  }
  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser)
        // console.log(currentUser);

        if (currentUser) {
            const userInfo = { email: currentUser?.email }
            //get token and store it in client side
            axiosCommon.post('/users', userInfo)
                .then((response) => {
                  
                   
                })
        } 
        setLoading(false)
    })
    return () => {
        return unsubscribed()
    };
}, [axiosCommon])

  const authInfo = {
   user,
    setUser,
   loading,
   setLoading,
   signInWithGoogle,
    createUser,
    signInWithEmail,
    LogOut,
    updateUserProfile
  };
 
  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;