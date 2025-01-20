import { useState } from 'react';
import { createFeedback } from '../../../store/feedback';

const FeedbackModal = ({ userId, onFeedbackAdded, isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		authorName: '',
		message: '',
		rating: 5,
	});
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const newFeedback = await createFeedback({ ...formData, userId });
			onFeedbackAdded(newFeedback);
			setFormData({ authorName: '', message: '', rating: 5 });
			onClose(); // Close modal on success
		} catch (err) {
			setError('Failed to add feedback');
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-white w-96 p-6 rounded shadow-lg relative'>
				<button
					onClick={onClose}
					className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'>
					&times;
				</button>
				<h2 className='text-xl font-semibold mb-4'>Submit Feedback</h2>
				<form onSubmit={handleSubmit} className='feedback-form'>
					{error && <p className='text-red-500 text-sm mb-2'>{error}</p>}
					<input
						type='text'
						name='authorName'
						placeholder='Your Name'
						value={formData.authorName}
						onChange={handleChange}
						required
						className='w-full border rounded px-3 py-2 mb-3'
					/>
					<textarea
						name='message'
						placeholder='Your Feedback'
						value={formData.message}
						onChange={handleChange}
						required
						className='w-full border rounded px-3 py-2 mb-3'
					/>
					<select
						name='rating'
						value={formData.rating}
						onChange={handleChange}
						required
						className='w-full border rounded px-3 py-2 mb-4'>
						{[1, 2, 3, 4, 5].map((r) => (
							<option key={r} value={r}>
								{r} Star{r > 1 && 's'}
							</option>
						))}
					</select>
					<button
						type='submit'
						className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full'>
						Submit Feedback
					</button>
				</form>
			</div>
		</div>
	);
};

export default FeedbackModal;
