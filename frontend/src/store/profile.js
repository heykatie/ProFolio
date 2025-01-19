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
	const response = await csrfFetch('/api/users', {
		method: 'POST',
		body: JSON.stringify(userData),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(createProfile(data.user));
		return data.user;
	} else {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Signup failed');
	}
};

// Get user by username
export const getUser = (userId) => async (dispatch) => {
	const response = await csrfFetch(`/api/users/${userId}`);

	if (response.ok) {
		const data = await response.json();
		dispatch(readProfile(data.user));
		return data.user;
	} else {
		const errorData = await response.json();
		throw new Error(errorData.message || 'User not found');
	}
};

// Update user profile
export const editProfile = (updateData) => async (dispatch) => {
	const userId = updateData.id
	const response = await csrfFetch(`/api/users/${userId}`, {
		method: 'PUT',
		body: JSON.stringify(updateData),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(updateProfile(data.user));
		return data.user;
	} else {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Failed to update user');
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
