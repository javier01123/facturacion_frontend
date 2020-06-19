import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createStore, compose, combineReducers, applyMiddleware } from "redux";
import reducer from "./store/reducers/reducer";
import { Provider } from "react-redux";
import {
  watchEmpresasReload,
  watchEmpresaChanged,
} from "./store/sagas/watcher";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/lib/integration/react";
import CustomSpinner from "./components/CustomSpinner/CustomSpinner";

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

ReactDOM.render(
  // <React.StrictMode>

  <Provider store={store}>
    <PersistGate loading={<CustomSpinner />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  // </React.StrictMode>
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
