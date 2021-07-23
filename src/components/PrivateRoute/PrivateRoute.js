
import React, {useContext} from 'react';
import { Route, Redirect } from "react-router-dom";
import AuthContext from "contexts/AuthContext.js";

const PrivateRoute = ({ component: Component, ...rest }) => {
    const authContext = useContext(AuthContext);
    return (
      <Route
        {...rest}
        render={props =>
          authContext.isAuthenticated() ? (
            <Component {...props} />
          ) : (
            <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location }
            }}
          />
          )
        }
      />
    );
  }

  export default PrivateRoute;