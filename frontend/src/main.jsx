import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store';

// Create a variable to access your store and expose it on the window.
const store = configureStore();

// should not be exposed in production
if (process.env.NODE_ENV !== 'production') {
  window.store = store;
}

// wrap the rendered App component in Redux’s Provider component, passing
// store as a prop of the same name to Provider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);