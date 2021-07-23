import React from "react";
import ReactDOM from "react-dom";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import teal from '@material-ui/core/colors/teal';
import App from "App";

const materialTheme = createMuiTheme({
  palette: {
    primary: teal
  },
});

ReactDOM.render(
  <ThemeProvider theme={materialTheme}>
    <App/>
  </ThemeProvider>,
  document.getElementById("root"));
