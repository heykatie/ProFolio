import { csrfFetch } from './csrf';

/* --- Action Types --- */
const CREATE_PROFILE = 'profile/createProfile';
const READ_PROFILE = 'profile/readProfile';
const UPDATE_PROFILE = 'profile/updateProfile';
const DELETE_PROFILE = 'profile/deleteProfile';

/* --- Action Creators --- */
const createProfile = (user) => ({
	type: CREATE_PROFILE,
	payload: user,
});

const readProfile = (user) => ({
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
		dispatch(createProfile(user));
		return user
	} catch (err) {
		const error = await err.json()
		throw error
	}
};

// Get user by username
export const getUser = (userId) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/users/${userId}`);
		const data = await response.json();
		dispatch(readProfile(data.user));
		return(data.user)
	} catch (err) {
		const error = await err.json()
		console.error(error || 'Failed to get user')
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
	const response = await csrfFetch(`/api/users/${userId}`, {
		method: 'DELETE',
	});

	if (response.ok) {
		dispatch(deleteProfile());
	} else {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Failed to delete user');
	}
};

/* --- Reducer --- */

const initialState = {user: null};

const profileReducer = (state = initialState, action) => {
	switch (action.type) {
		case CREATE_PROFILE:
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
