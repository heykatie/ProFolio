import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/session';
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

	// Dropdown menu items
	const dropdownItems = [
		{ label: 'Dashboard', path: '/dashboard' },
		{ label: 'Edit Profile', path: `/profile` },
		{ label: 'Your Portfolios', path: '/portfolios' },
		{ label: 'Preview Portfolio', path: '/preview' },
		{ label: 'Your Projects', path: '/projects' },
		{ label: 'Your Favorites', path: '/favorites' },
		{ label: 'Recent Activity', path: '/activity' },
		{ label: 'Create New', path: '/create' },
		{ label: 'Settings', path: '/settings' },
	];

	// Return null if no session user
	if (!sessionUser) {
		return null;
	}

	return (
		<div className='relative'>
			{/* Profile Button */}
			<button
				onClick={toggleMenu}
				aria-haspopup='menu'
				aria-expanded={showMenu}
				className='profile-button flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-on-secondary shadow-md hover:bg-secondary-hover dark:bg-secondary-dark dark:text-on-secondary-dark dark:hover:bg-secondary-darkhover'>
				<FaCarrot className='w-5 h-5' />
			</button>

			{/* Dropdown Menu */}
			{showMenu && (
				<div
					className='absolute right-0 mt-2 w-56 bg-surface rounded-md shadow-lg border border-gray-200 dark:bg-surface-dark dark:border-gray-600 dropdown-enter dropdown-enter-active'
					ref={dropdownRef}>
					<ul className='py-2 text-sm text-text-primary dark:text-text-primary-dark'>
						<li className='px-4 py-2 font-semibold'>
							{sessionUser.username}
						</li>
						<li className='px-4 py-2'>{`${sessionUser.firstName} ${sessionUser.lastName}`}</li>
						<hr className='border-gray-200 dark:border-gray-600' />
						{dropdownItems.map((item, idx) => (
							<li
								key={idx}
								className='dropdown-item'
								onClick={() =>
									navigate(item.path) && setShowMenu(false)
								}>
								{item.label}
							</li>
						))}
						<li className='dropdown-item-logout' onClick={handleLogout}>
							Logout
						</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default ProfileButton;
