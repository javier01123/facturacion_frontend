import React from "react";
import { Route, Switch, Router } from "react-router";
import { Link } from "react-router-dom";
import ErrorBoundary from  "./components/ErrorHandlers/ErrorBoundary/ErrorBoundary";
import Home from "./containers/Home/Home";
import Login from "./containers/PantallaLogin/PantallaLogin";
import { createBrowserHistory } from "history";
import "antd/dist/antd.css";


const App = () => {

  const history = createBrowserHistory();

  return (
    <Router history={history}>
    <Switch>
      <Route path="/login">
        <Login />
      </Route>

      <Route path="/">
        <Home />
      </Route>
    </Switch>
    </Router>
  );
};

export default App;
