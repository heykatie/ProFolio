import { useState } from 'react';
import FeedbackList from '../Feedback';
import FeedbackForm from '../../Modals/FeedbackModal';

const Preview = ({ userId }) => {
	const [feedback, setFeedback] = useState([]);

	const handleFeedbackAdded = (newFeedback) => {
		setFeedback((prev) => [...prev, newFeedback]);
	};

	return (
		<div>
			<h1>Preview Page</h1>
			<div className='portfolio-page'>
				<h1>User Portfolio</h1>
				<FeedbackForm
					userId={userId}
					onFeedbackAdded={handleFeedbackAdded}
				/>
				<FeedbackList userId={userId} />
			</div>
		</div>
	);
};

export default Preview;
