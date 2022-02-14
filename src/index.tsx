import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { NativeBaseProvider, extendTheme } from "native-base";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import reportWebVitals from "./reportWebVitals";

const theme = extendTheme({
  config: {
    initialColorMode: (
      localStorage.getItem("theme")
        ? localStorage.getItem("theme") === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? true
        : false
    )
      ? "dark"
      : "light",
  },
});

const options = {
  position: positions.MIDDLE,
  offset: "-100px",
  timeout: 2500,
  transition: transitions.FADE,
};

ReactDOM.render(
  <React.StrictMode>
    <NativeBaseProvider theme={theme}>
      <AlertProvider template={AlertTemplate} {...options}>
        <App />
      </AlertProvider>
    </NativeBaseProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
