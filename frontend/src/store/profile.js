import { csrfFetch } from './csrf';

/* --- Action Types --- */
const SET_PROFILE = 'profile/setProfile';
const READ_PROFILE = 'profile/readProfile';
const UPDATE_PROFILE = 'profile/updateProfile';
const DELETE_PROFILE = 'profile/deleteProfile';

/* --- Action Creators --- */
export const setProfile = (user) => ({
	type: SET_PROFILE,
	payload: user,
});

export const readProfile = (user) => ({
	type: READ_PROFILE,
	payload: user,
});

const updateProfile = (user) => ({
	type: UPDATE_PROFILE,
	payload: user,
});

const deleteProfile = () => ({
	type: DELETE_PROFILE,
});

/* --- Thunks --- */
// Sign up
export const signup = (userData) => async (dispatch) => {
	try {
		const response = await csrfFetch('/api/users', {
			method: 'POST',
			body: JSON.stringify(userData),
		});
		const { user } = await response.json()
		dispatch(setProfile(user));
		return user
	} catch (err) {
		const error = await err.json()
		throw error
	}
};

// Get user by id
export const getUser = (userId) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/users/${userId}`);
		const data = await response.json();
		dispatch(readProfile(data.user));
		return(data.user)
	} catch (err) {
		const error = await err.json()
		console.error(error.errors || 'Failed to get user')
	}
};

// Update user profile
export const editProfile = ({userId, updateData}) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/users/${userId}`, {
			method: 'PUT',
			body: JSON.stringify(updateData),
		});
		if (response.ok) {
			const data = await response.json();
			dispatch(updateProfile(data.user));
			return data.user;
		}
	} catch (err) {
		const error = await err.json()
		throw error;
	}
};

// Delete user profile
export const deleteAccount = (userId) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/users/${userId}`, {
			method: 'DELETE',
		});
		if (response.ok) {
			dispatch(deleteProfile());
		}
	} catch (err) {
		const error = await err.json();
		throw error;
	}
};

/* --- Reducer --- */

const initialState = {user: null};

const profileReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_PROFILE:
		case READ_PROFILE:
		case UPDATE_PROFILE:
			return { ...state, user: action.payload };
		case DELETE_PROFILE:
			return { ...state, user: null };
		default:
			return state;
	}
};

export default profileReducer;
