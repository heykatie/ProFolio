import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import './RecentActivity.css';

const RecentActivity = () => {
	const sessionUser = useSelector((state) => state.session.user);
	const [activity, setActivity] = useState([]);

	useEffect(() => {
		const fetchActivity = async () => {
			const response = await fetch(`/api/users/${sessionUser.id}/activity`);
			if (response.ok) {
				const data = await response.json();
				setActivity(data.activities);
			}
		};
		fetchActivity();
	}, [sessionUser]);

	return (
		<div className='recent-activity'>
			<h2>Recent Activity</h2>
			<ul>
				{activity.map((item, idx) => (
					<li key={idx}>
						<p>{item.description}</p>
						<span>{new Date(item.createdAt).toLocaleString()}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default RecentActivity;
