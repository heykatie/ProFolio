import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/session';
import './ProfileButton.css';
import { FaCarrot } from 'react-icons/fa6';

const ProfileButton = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const sessionUser = useSelector((state) => state.session.user);
	const [showMenu, setShowMenu] = useState(false);
	const dropdownRef = useRef();

	// Close menu if clicked outside or Escape key is pressed
	useEffect(() => {
		const closeMenu = (e) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target) &&
				!e.target.closest('.profile-button')
			) {
				setShowMenu(false);
			}
		};
		const handleEscape = (e) => {
			if (e.key === 'Escape') {
				setShowMenu(false);
			}
		};
		document.addEventListener('click', closeMenu);
		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('click', closeMenu);
			document.removeEventListener('keydown', handleEscape);
		};
	}, []);

	// Toggle the dropdown menu
	const toggleMenu = () => {
		setShowMenu((prev) => !prev);
	};

	// Handle user logout
	const handleLogout = async () => {
		await dispatch(logout());
		navigate('/');
	};

	// Return null if no session user
	if (!sessionUser) {
		return null;
	}

	return (
		<div className='profile-button-container'>

			<button onClick={toggleMenu} className='profile-button'>
				<span className='profile-icon'>
					<FaCarrot />
				</span>
			</button>

			{showMenu && (
				<div className='profile-dropdown' ref={dropdownRef}>
					<ul>
						<li>{sessionUser.username}</li>
						<li>{sessionUser.firstName} {sessionUser.lastName}</li>
						<li onClick={() => navigate('/dashboard')}>Dashboard</li>
						<li onClick={() => navigate(`/${sessionUser.username}`)}>
							View Profile
						</li>
						<li onClick={() => navigate('/portfolios')}>
							Your Portfolios
						</li>
						<li onClick={() => navigate('/preview')}>
							Preview Portfolio
						</li>
						<li onClick={() => navigate('/projects')}>Your Projects</li>
						<li onClick={() => navigate('/favorites')}>Your Favorites</li>
						<li onClick={() => navigate('/activity')}>Recent Activity</li>
						<li onClick={() => navigate('/create')}>Create New</li>
						<li onClick={() => navigate('/settings')}>Settings</li>
						<li onClick={handleLogout}>Logout</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default ProfileButton;
