import { csrfFetch } from './csrf';

// Action Types
const SET_THEME = 'user/SET_THEME';

// Action Creators
const setTheme = (theme) => ({
	type: SET_THEME,
	theme,
});

// Thunks
export const fetchTheme = (userId) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/users/${userId}`);
		const data = await response.json();
		const theme = data.themePreferences || 'light';
		dispatch(setTheme(theme));
		return theme;
	} catch (error) {
		console.error('Failed to fetch user theme:', error);
		throw error;
	}
};

export const updateTheme = (theme) => async (dispatch) => {
	try {
		await csrfFetch('/api/users/theme', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ theme }),
		});
		dispatch(setTheme(theme));
	} catch (error) {
		console.error('Failed to update theme:', error);
		throw error;
	}
};

// Reducer
const initialState = { theme: 'light' };

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_THEME:
			return { ...state, theme: action.theme };
		default:
			return state;
	}
};

export default userReducer;
