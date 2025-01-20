import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
	getFeedbackForUser,
	createFeedback,
	updateFeedback,
	deleteFeedback,
} from '../../../store/feedback';
import FeedbackModal from '../../Modals/FeedbackModal';

const FeedbackList = ({ userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
	const [feedback, setFeedback] = useState([]);
	const [error, setError] = useState(null);
	const dispatch = useDispatch();
	// Fetch feedback
	useEffect(() => {
		dispatch(getFeedbackForUser(userId));
	}, [dispatch, userId]);

	// Create feedback
	const handleCreate = async () => {
		await dispatch(
			createFeedback({
				userId,
				authorName: 'John',
				message: 'Great job!',
				rating: 5,
			})
		);
	};

	// Update feedback
	const handleUpdate = async (feedbackId) => {
		await dispatch(
			updateFeedback(feedbackId, { message: 'Updated feedback' })
		);
	};

	// Delete feedback
	const handleDelete = async (feedbackId) => {
		await dispatch(deleteFeedback(feedbackId));
  };

  const handleFeedbackAdded = (newFeedback) => {
		console.log('Feedback added:', newFeedback);
		// Handle the new feedback (e.g., update the state or refresh the list)
  };

	if (error) return <p className='error'>{error}</p>;

  return (
		<div>
			<div className='feedback-list'>
				<h2>Feedback</h2>
				{feedback.length === 0 ? (
					<p>No feedback available.</p>
				) : (
					feedback.map((item) => (
						<div key={item.id} className='feedback-item'>
							<h3>{item.authorName}</h3>
							<p>{item.message}</p>
							<p>Rating: {item.rating || 'N/A'}</p>
							<button onClick={() => handleDelete(item.id)}>
								Delete
							</button>
						</div>
					))
				)}
			</div>
			<div>
				<button
					onClick={() => setIsModalOpen(true)}
					className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
					Add Feedback
				</button>
				<FeedbackModal
					userId={userId}
					isOpen={isModalOpen}
					onFeedbackAdded={handleFeedbackAdded}
					onClose={() => setIsModalOpen(false)}
				/>
			</div>
		</div>
  );
};

export default FeedbackList;
