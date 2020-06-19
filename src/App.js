import React from "react";
import { Route, Switch, Router } from "react-router";
import Home from "./containers/Home/Home";
import Login from "./containers/PantallaLogin/PantallaLogin";
import { createBrowserHistory } from "history";
import { createStore, compose, applyMiddleware } from "redux";
import reducer from "./store/reducers/reducer";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/lib/integration/react";
import CustomSpinner from "./components/CustomSpinner/CustomSpinner";
import {
  watchEmpresasReload,
  watchEmpresaChanged,
} from "./store/sagas/watcher";
import "antd/dist/antd.css";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: "root",
  storage,
};

// const rootReducer = combineReducers({reducer});
const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

const persistor = persistStore(store);

sagaMiddleware.run(watchEmpresasReload);
sagaMiddleware.run(watchEmpresaChanged);

const App = () => {
  const history = createBrowserHistory();

  return (
    <Provider store={store}>
      <PersistGate loading={<CustomSpinner />} persistor={persistor}>
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
      </PersistGate>
    </Provider>
  );
};

export default App;
