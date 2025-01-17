import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import LoginModal from '../LoginModal';
import SignupModal from '../SignupModal';
import ProfileButton from '../ProfileButton';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { logout } from '../../store/session';
import './Navbar.css';

const Navbar = () => {
	// const dispatch = useDispatch();
	// const navigate = useNavigate();
	const sessionUser = useSelector((state) => state.session.user);
	const [activeModal, setActiveModal] = useState(null); // Tracks the current open modal
	const [theme, setTheme] = useState('light');

	// Handle logout
	// const handleLogout = async () => {
	// 	await dispatch(logout());
	// 	navigate('/');
	// };

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
				<NavLink to='/' className='navbar-brand'>
					ProFolio
				</NavLink>
			</div>

			<div className='navbar-links'>
				{/* Theme Toggle */}
				<button
					className='theme-toggle'
					onClick={toggleTheme}
					aria-label={`Switch to ${
						theme === 'light' ? 'dark' : 'light'
					} mode`}>
					{theme === 'light' ? '🌙' : '☀️'}
				</button>

				{/* Conditional rendering based on session user */}
				{sessionUser ? (
					// Show profile button when user is logged in
					<ProfileButton user={sessionUser} />
				) : (
					// Show login and signup options when no session user
					<>
						<div className='navbar-link'>
							<button onClick={() => setActiveModal('signup')}>
								Sign Up
							</button>
						</div>
						<div className='navbar-link'>
							<button onClick={() => setActiveModal('login')}>
								Log In
							</button>
						</div>
					</>
				)}

				{/* Modals */}
				<ReactModal
					isOpen={activeModal === 'signup'}
					onRequestClose={() => setActiveModal(null)}
					ariaHideApp={false}>
					<SignupModal closeModal={() => setActiveModal(null)} />
				</ReactModal>

				<ReactModal
					isOpen={activeModal === 'login'}
					onRequestClose={() => setActiveModal(null)}
					ariaHideApp={false}>
					<LoginModal closeModal={() => setActiveModal(null)} />
				</ReactModal>
			</div>
		</nav>
	);
};

export default Navbar;
