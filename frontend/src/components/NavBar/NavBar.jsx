import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useModal } from '../../context/ModalContext';
import SignupModal from '../Modals/SignupModal';
import LoginModal from '../Modals/LoginModal';
import ProfileButton from '../ProfileButton';
import { fetchTheme, updateTheme } from '../../store/user';
import profolioIcon from '../../../../images/profolio-icon.png'
import './Navbar.css';

const Navbar = () => {
	const sessionUser = useSelector((state) => state.session.user);
	const [localTheme, setLocalTheme] = useState('light');
	const theme = useSelector((state) => state.user?.theme || 'light');
	const dispatch = useDispatch();
	const { setModalContent } = useModal();

	// Open Signup Modal
	const openSignupModal = () => {
		setModalContent(<SignupModal />);
	};

	// Open Login Modal
	const openLoginModal = () => {
		setModalContent(<LoginModal />);
	};

	// Toggle theme between light and dark
	const toggleTheme = () => {
		const newTheme =
			(sessionUser ? theme : localTheme) === 'light' ? 'dark' : 'light';
		if (sessionUser) {
			// Update theme in the database and Redux state
			dispatch(updateTheme(newTheme))
				.catch((err) => console.error('Failed to update theme:', err));
		} else {
			// Update theme locally
			setLocalTheme(newTheme);
			document.documentElement.setAttribute('data-theme', newTheme);
			localStorage.setItem('theme', newTheme);
		}
	};

	// Load theme from local storage on mount
	useEffect(() => {
		const applySavedTheme = async () => {
			if (sessionUser) {
				try {
					// Fetch the theme from Redux if user is logged in
					const savedTheme = await dispatch(fetchTheme(sessionUser.id));
					document.documentElement.setAttribute('data-theme', savedTheme);
				} catch (error) {
					console.error('Error applying saved theme:', error);
				}
			} else {
				// Retrieve theme from localStorage for non-logged-in users
				const savedTheme = localStorage.getItem('theme') || 'light';
				setLocalTheme(savedTheme);
				document.documentElement.setAttribute('data-theme', savedTheme);
			}
			if (typeof sessionUser !== 'undefined' || null) {
				applySavedTheme();
			}
		};

		if (sessionUser === 'cutie') return applySavedTheme;
	}, [dispatch, sessionUser]);

	useEffect(() => {
		if (sessionUser) {
			document.documentElement.setAttribute('data-theme', theme);
		}
	}, [theme, sessionUser]);

	return (
		<nav className='navbar'>
			<div className='navbar-logo'>
				<NavLink to='/' className='navbar-logo-link'>
					<img
						src={profolioIcon}
						alt='ProFolio LetterMark'
						className='navbar-logo-icon'
					/>
					ProFolio
				</NavLink>
			</div>

			<div className='navbar-actions'>
				{/* Theme Toggle */}
				<button
					className='navbar-theme-toggle'
					onClick={toggleTheme}
					aria-label={`Switch to ${
						theme === 'light' ? 'dark' : 'light'
					} mode`}>
					{theme === 'light' ? '🌙' : '☀️'}
				</button>

				{/* Conditional rendering based on session user */}
				{sessionUser ? (
					<ProfileButton />
				) : (
					<div className='navbar-auth-actions'>
						<button onClick={openLoginModal} className='navbar-login-btn'>
							Log In
						</button>
						<button
							onClick={openSignupModal}
							className='navbar-signup-btn'>
							Sign Up
						</button>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
