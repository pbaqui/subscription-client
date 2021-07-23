import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "utils/History";
import Admin from "layouts/Admin";
import Signin from "views/Signin/Signin";
import PrivateRoute from "components/PrivateRoute/PrivateRoute";
import AuthProvider from "contexts/AuthProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import "assets/css/material-dashboard-react.css?v=1.9.0";
import { UserProvider } from "components/UserProvider";

const App = () => {
  return (
    <Router history={history}>
      <AuthProvider>    
        <Switch>
          {/* <Route path="/admin" component={Admin} /> */}
          <Route path="/signin" component={Signin} />
          <UserProvider>
            <PrivateRoute path="/" component={Admin} />
          </UserProvider>
        </Switch>
      </AuthProvider>
      <ToastContainer />
    </Router>
  );
};

export default App;