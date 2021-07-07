import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "./Config";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Room from "./Components/Pages/Room/Room";
import Home from "./Components/Pages/Home/Home";

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/" exact component={App} />
      <Route path="/room" exact component={Room} />
      <Route path="/home" exact component={Home} />
    </Switch>
  </Router>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
