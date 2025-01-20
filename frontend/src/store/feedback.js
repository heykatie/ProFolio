import { csrfFetch } from './csrf';

// Action Types
const LOAD_FEEDBACK = 'feedback/loadFeedback';
const ADD_FEEDBACK = 'feedback/addFeedback';
const UPDATE_FEEDBACK = 'feedback/updateFeedback';
const REMOVE_FEEDBACK = 'feedback/removeFeedback';

// Action Creators
const loadFeedback = (feedback) => ({
	type: LOAD_FEEDBACK,
	payload: feedback,
});

const addFeedback = (feedback) => ({
	type: ADD_FEEDBACK,
	payload: feedback,
});

const updateFeedbackAction = (feedback) => ({
	type: UPDATE_FEEDBACK,
	payload: feedback,
});

const removeFeedback = (id) => ({
	type: REMOVE_FEEDBACK,
	payload: id,
});

// Thunks

// Fetch all feedback for a specific user
export const getFeedbackForUser = (userId) => async (dispatch) => {
	const response = await csrfFetch(`/api/feedback/${userId}`);
	if (response.ok) {
		const feedback = await response.json();
		dispatch(loadFeedback(feedback));
	} else {
		throw new Error('Failed to load feedback');
	}
};

// Create new feedback
export const createFeedback = (feedbackData) => async (dispatch) => {
	const response = await csrfFetch(`/api/feedback`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(feedbackData),
	});

	if (response.ok) {
		const feedback = await response.json();
		dispatch(addFeedback(feedback));
		return feedback;
	} else {
		const errorData = await response.json();
		throw new Error(errorData.error || 'Failed to create feedback');
	}
};

// Update feedback
export const updateFeedback =
	(feedbackId, feedbackData) => async (dispatch) => {
		const response = await csrfFetch(`/api/feedback/${feedbackId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(feedbackData),
		});

		if (response.ok) {
			const updatedFeedback = await response.json();
			dispatch(updateFeedbackAction(updatedFeedback));
			return updatedFeedback;
		} else {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to update feedback');
		}
	};

// Delete feedback
export const deleteFeedback = (feedbackId) => async (dispatch) => {
	const response = await csrfFetch(`/api/feedback/${feedbackId}`, {
		method: 'DELETE',
	});

	if (response.ok) {
		dispatch(removeFeedback(feedbackId));
	} else {
		throw new Error('Failed to delete feedback');
	}
};

// Reducer
const feedbackReducer = (state = {}, action) => {
	switch (action.type) {
		case LOAD_FEEDBACK:
			const feedbackObj = {};
			action.payload.forEach((fb) => (feedbackObj[fb.id] = fb));
			return { ...state, ...feedbackObj };

		case ADD_FEEDBACK:
			return { ...state, [action.payload.id]: action.payload };

		case UPDATE_FEEDBACK:
			return { ...state, [action.payload.id]: action.payload };

		case REMOVE_FEEDBACK:
			const newState = { ...state };
			delete newState[action.payload];
			return newState;

		default:
			return state;
	}
};

export default feedbackReducer;
