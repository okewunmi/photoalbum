import React, {useContext, useEffect, useState, createContext} from 'react'
import {getCurrentUser} from '../lib/appwrite'

const GlobalContext = createContext()
export const useGlobalContext = ()=> useContext(GlobalContext);

const GlobalProvider = ({children}) => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setisLoggedIn(true);
          setUser(res);
        } else {
          setUser(null);
          setisLoggedIn(false);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
    
  )
}

export default GlobalProvider
