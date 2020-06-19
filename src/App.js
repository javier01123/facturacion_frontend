import React from "react";
import { Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import ErrorBoundary from  "./components/ErrorHandlers/ErrorBoundary/ErrorBoundary";
import Home from "./containers/Home/Home";
import Login from "./containers/PantallaLogin/PantallaLogin";
import "antd/dist/antd.css";

const App = () => {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>

      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
};

export default App;
