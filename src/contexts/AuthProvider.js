
import React, {useState, useEffect} from 'react';
import AuthService from "../services/AuthService";
import AuthContext from "contexts/AuthContext";

const initialValueUser = "";

const AuthContextProvider = props => {
    const [user, setUser] = useState(initialValueUser);
   
    const updateUser = ()  => {
     let user = AuthService.getUserAuthenticated();
     if (user) {
      setUser(user.username);
     }
    }

    const logout = () => {
        AuthService.signout();
    }

    const isAuthenticated = () => {
      return AuthService.isAuthenticated();
    }

    useEffect(() => updateUser(), []);
     return (
      <AuthContext.Provider
        value={{
          updateUser,
          user,
          isAuthenticated : isAuthenticated,
          logout
        }}
      >
        {props.children}
      </AuthContext.Provider>
    );
}

export default AuthContextProvider;