import { csrfFetch } from './csrf';

/* --- Action Types --- */
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

/* --- Action Creators --- */
const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
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
    dispatch(setUser(data.user));
    return data.user;
  }
};

// Restore user session
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/session');

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.user));
    return data.user;
  }
};

// Sign up
export const signup = (userData) => async (dispatch) => {
  const response = await csrfFetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.user));
    return data.user;
  }
};

// Log out
export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(removeUser());
  }
};

/* --- Reducer --- */

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default sessionReducer;