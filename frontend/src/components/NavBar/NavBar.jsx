import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useModal } from '../../context/ModalContext';
import SignupModal from '../Modals/SignupModal';
import LoginModal from '../Modals/LoginModal';
import ProfileButton from '../ProfileButton';
import './Navbar.css';

const Navbar = () => {
	const sessionUser = useSelector((state) => state.session.user);
	const [theme, setTheme] = useState('light');
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
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		document.documentElement.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
	};

	// Load theme from local storage on mount
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') || 'light';
		setTheme(savedTheme);
		document.documentElement.setAttribute('data-theme', savedTheme);
	}, []);

	return (
		<nav className='navbar'>
			<div className='navbar-logo'>
				<NavLink to='/' className='navbar-logo-link'>
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
						<button
							onClick={openSignupModal}
							className='navbar-signup-btn'>
							Sign Up
						</button>
						<button onClick={openLoginModal} className='navbar-login-btn'>
							Log In
						</button>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
