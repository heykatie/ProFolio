import { csrfFetch } from './csrf';
import { getUser } from './profile';
import {setTheme } from './theme'

/* --- Action Types --- */
const CREATE_SESSION = 'session/createSession';
const DELETE_SESSION = 'session/deleteSession';

/* --- Action Creators --- */
const createSession = (user) => ({
	type: CREATE_SESSION,
	payload: user,
});

const deleteSession = () => ({
	type: DELETE_SESSION,
});

/* --- Thunks --- */

// Log in
export const login = (userData) => async (dispatch) => {
  const { credential, password } = userData;
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(createSession(data.user));
    const user = dispatch(getUser(data.user.id));
    dispatch(setTheme(user.themePreference))
    return data.user;
  }
};

// Restore user session
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/session');

  if (response.ok) {
    const data = await response.json();
    dispatch(createSession(data.user));
    const user = dispatch(getUser(data.user.id));
    dispatch(setTheme(user.themePreference));
    return data.user;
  }
};

// Log out
export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(deleteSession());
  }
};

/* --- Reducer --- */

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
		case CREATE_SESSION:
			return { ...state, user: action.payload };
		case DELETE_SESSION:
			return { ...state, user: null };
		default:
			return state;
  }
};

export default sessionReducer;