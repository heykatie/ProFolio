import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import sessionReducer from './session';
import userReducer from './user';

const rootReducer = combineReducers({
  session: sessionReducer,
  user: userReducer
});

// set to different store enhancers depending on whether the Node environment
// is development or production
// In production, the enhancer should only apply the thunk middleware
let enhancer;
if (import.meta.env.MODE === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

// This function will be used by main.jsx to attach the Redux
// store to the React application
export default configureStore;