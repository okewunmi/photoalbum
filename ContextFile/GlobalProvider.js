import React, { useContext, useEffect, useState, createContext } from "react";
// import { getCurrentUser } from "../lib/appwrite";
import { auth, db } from "../lib/firebase";
// import authConfig from "../lib/authConfig";
import { onAuthStateChanged } from "firebase/auth";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //   });
  //   return () => unsubscribe();
  // }, []);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setisLoggedIn(true);
        setUser(user);
      } else {
        setisLoggedIn(false);
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // return user ? <HomeScreen /> : <LoginScreen />;
  // const logout = async () => {
  //   await signOut(auth);
  // };

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setisLoggedIn,
        user,
        setUser,
        loading,
        setLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
