import React from "react";
import ReactDOM from "react-dom"; // Cambia esta línea
import { render } from 'react-dom'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'


import App from "./App";
import "./index.css";
const options = {
  // you can also just use 'bottom center'
  position: positions.MIDDLE,
  timeout: 3000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.FADE
}
const Root = () => (
  <AlertProvider template={AlertTemplate} {...options}>
    <App />
  </AlertProvider>
)

render(<Root />, document.getElementById('root'))