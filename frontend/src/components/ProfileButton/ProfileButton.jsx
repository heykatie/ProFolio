import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/session';
import { FaCarrot } from 'react-icons/fa6';
import './ProfileButton.css';

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
		<div className='profile-container'>
			<button onClick={toggleMenu} className='profile-button'>
				<span className='profile-icon'>
					<FaCarrot />
				</span>
			</button>

			{showMenu && (
				<div className='profile-dropdown' ref={dropdownRef}>
					<ul className='profile-dropdown-list'>
						<li className='profile-dropdown__item--username'>
							{sessionUser.username}
						</li>
						<li className='profile-dropdown__item--full-name'>
							{sessionUser.firstName} {sessionUser.lastName}
						</li>
						<li
							className='profile-dropdown__item--dashboard'
							onClick={() => navigate('/dashboard')}>
							Dashboard
						</li>
						<li
							className='profile-dropdown__item--profile'
							onClick={() => navigate(`/${sessionUser.username}`)}>
							View Profile
						</li>
						<li
							className='profile-dropdown__item--portfolios'
							onClick={() => navigate('/portfolios')}>
							Your Portfolios
						</li>
						<li
							className='profile-dropdown__item--preview'
							onClick={() => navigate('/preview')}>
							Preview Portfolio
						</li>
						<li
							className='profile-dropdown__item--projects'
							onClick={() => navigate('/projects')}>
							Your Projects
						</li>
						<li
							className='profile-dropdown__item--faves'
							onClick={() => navigate('/favorites')}>
							Your Favorites
						</li>
						<li
							className='profile-dropdown__item--activity'
							onClick={() => navigate('/activity')}>
							Recent Activity
						</li>
						<li
							className='profile-dropdown__item--create'
							onClick={() => navigate('/create')}>
							Create New
						</li>
						<li
							className='profile-dropdown__item--settings'
							onClick={() => navigate('/settings')}>
							Settings
						</li>
						<li
							className='profile-dropdown__item--logout'
							onClick={handleLogout}>
							Logout
						</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default ProfileButton;
