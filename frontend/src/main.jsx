import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';

// Create a variable to access your store and expose it on the window.
const store = configureStore();

if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

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