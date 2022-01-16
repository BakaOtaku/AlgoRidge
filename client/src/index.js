import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import { Web3Provider } from "./contexts/Web3Context";
import { AlgoProvider } from "./contexts/MyAlgoContext";
import App from "./App";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Web3Provider>
      <AlgoProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AlgoProvider>
    </Web3Provider>
  </ThemeProvider>,
  document.querySelector("#root")
);
