import { csrfFetch } from './csrf';

/* --- Action Types --- */
const CREATE_USER = 'user/createUser';
const READ_USER = 'user/readUser';
const UPDATE_USER = 'user/updateUser';
const DELETE_USER = 'user/deleteUser';

/* --- Action Creators --- */
const createUser = (user) => ({
	type: CREATE_USER,
	payload: user,
});

const readUser = (user) => ({
	type: READ_USER,
	payload: user,
});

const updateUser = (user) => ({
	type: UPDATE_USER,
	payload: user,
});

const deleteUser = () => ({
	type: DELETE_USER,
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
		dispatch(createUser(data.user));
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
		dispatch(readUser(data.user));
		return data.user;
	} else {
		const errorData = await response.json();
		throw new Error(errorData.message || 'User not found');
	}
};

// Update user profile
export const updateUserProfile = (userId, updateData) => async (dispatch) => {
	const response = await csrfFetch(`/api/users/${userId}`, {
		method: 'PUT',
		body: JSON.stringify(updateData),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(updateUser(data.user));
		return data.user;
	} else {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Failed to update user');
	}
};

// Delete user profile
export const deleteUserProfile = (userId) => async (dispatch) => {
	const response = await csrfFetch(`/api/users/${userId}`, {
		method: 'DELETE',
	});

	if (response.ok) {
		dispatch(deleteUser());
	} else {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Failed to delete user');
	}
};

/* --- Reducer --- */

const initialState = { user: null };

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case CREATE_USER:
		case READ_USER:
		case UPDATE_USER:
			return { ...state, user: action.payload };
		case DELETE_USER:
			return { ...state, user: null };
		default:
			return state;
	}
};

export default userReducer;
