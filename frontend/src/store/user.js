import { csrfFetch } from './csrf';
import setUser from './session';

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
	try {
		const response = await csrfFetch('/api/users', {
			method: 'POST',
			body: JSON.stringify(userData),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw errorData.errors || { general: 'Unexpected error' };
		}

		const data = await response.json();
		dispatch(createUser(data.user));
		dispatch(setUser(data.user)); // Set session user
		return data.user;
	} catch (err) {
		// Simplify error handling to return the `errors` object or throw a generic error
		throw err.errors || { general: 'Signup failed' };
	}
};

// Get user by ID
export const getUserById = (userId) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/users/${userId}`);

		if (!response.ok) throw await response.json();

		const user = await response.json();
		dispatch(readUser(user));
		return user;
	} catch (err) {
		throw err.message || 'User not found';
	}
};

// Update user profile
export const updateProfile = (updateData) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/users/${updateData.id}`, {
			method: 'PUT',
			body: JSON.stringify(updateData),
		});

		if (!response.ok) throw await response.json();

		const data = await response.json();
		dispatch(updateUser(data.user));
		return data.user;
	} catch (err) {
		throw err.message || 'Failed to update user';
	}
};

// Delete user profile
export const deleteProfile = (userId) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/users/${userId}`, {
			method: 'DELETE',
		});

		if (!response.ok) throw await response.json();

		dispatch(deleteUser());
	} catch (err) {
		throw err.message || 'Failed to delete user';
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
