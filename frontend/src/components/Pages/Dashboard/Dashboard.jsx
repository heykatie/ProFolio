import { useEffect, useState} from 'react';
import { fetchTheme, setTheme, updateTheme } from '../../../store/theme';
import { useSelector, useDispatch } from 'react-redux';

const Dashboard = () => {
	const sessionUser = useSelector((state) => state.session.user);
	const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme?.theme);

	useEffect( () => {
		if (sessionUser) {
			const localTheme = localStorage.getItem('theme') || 'light';
    } else {
    }
	}, [dispatch, sessionUser]);

	return (
		<div>
			<div>
				<h1>Dashboard Page</h1>
			</div>
			<span>
				localStorage: {localStorage.getItem('theme')}
				<br></br>
				shows - state/slice: {theme}
				<br></br>
				user: ?
			</span>
		</div>
	);
};

export default Dashboard;
