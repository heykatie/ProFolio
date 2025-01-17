import { csrfFetch } from './csrf';

// Action Types
const GET_THEME = 'theme/GET_THEME';
const SET_THEME = 'theme/SET_THEME';

// Action Creators
export const getTheme = (theme) => ({
	type: GET_THEME,
	theme,
});

export const setTheme = (theme) => ({
	type: SET_THEME,
	theme,
});

// Thunks

// get user's theme & set to slice
export const fetchTheme = (userId) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/theme/${userId}`);
		const theme = await response.json();
		dispatch(setTheme(theme));
		return theme;
	} catch (error) {
		console.error('Failed to fetch user theme:', error.message || error);
		throw error;
	}
};

// update theme slice & user's preference
export const updateTheme = (theme) => async (dispatch) => {
	try {
		await csrfFetch('/api/theme/update', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ theme }),
		});
		dispatch(setTheme(theme));
	} catch (error) {
		console.error('Failed to update theme:', error);
		throw error;
	}
};

const initialState = {
  theme: localStorage.getItem('theme') || 'light', // Default to saved theme or 'light'
};

const themeReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_THEME:
    case SET_THEME:
      localStorage.setItem('theme', action.theme);
			document.documentElement.setAttribute('data-theme', action.theme);
			if (action.theme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
      return { ...state, theme: action.theme };
    default:
      return state;
  }
};

export default themeReducer;
