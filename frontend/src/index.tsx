import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './components/Login';
import store from './store';
import { Provider } from "react-redux";
import CurrentUser from './components/CurrentUser';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CurrentUser>
        <App />
      </CurrentUser>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
