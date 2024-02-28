import { createContext, useContext, useEffect, useState } from 'react';
import { getAccessToken, fetchValidTokenCheck } from '../helpers/AccessTokenHelper.js';

const AuthContext = createContext();

/**
 * authentication provider component
 * 
 * @component
 * @param {object} props - component props
 * @param {ReactNode} props.children - the child components wrapped by the AuthProvider
 */
export function Auth({ children }) {
  const [signedIn, setsignedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const accessToken = await getAccessToken();
        //user doed not have access token in storage
        if (accessToken == null) {
            setsignedIn(false);
        } else {
          //user has access token in storage 
          //check for valid access token
          const result = await fetchValidTokenCheck(accessToken);
          if (result === true) {
          setsignedIn(true); //user is signed in
          } else {
          setsignedIn(false); //invalid token
          }
        }
        
      } catch (error) {
        console.error('Error in fetching / checking access token:', error);
      }
    };
  
    checkToken();
  }, []);
  
  //functions to set sign in / sign out
  const signIn = () => {
    setsignedIn(true);
  };

  const signOut = () => {
    setsignedIn(false);
  };
  

  const value = {
    signedIn,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}