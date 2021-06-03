import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import ReduxThunk from 'redux-thunk';
import rootReducer from "./Modules";
import {composeWithDevTools} from "redux-devtools-extension";
import 'react-accessible-accordion/dist/fancy-example.css';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(ReduxThunk)));

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
