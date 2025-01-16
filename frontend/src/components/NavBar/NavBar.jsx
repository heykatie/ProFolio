import { useState } from 'react';
import ReactModal from 'react-modal';
import LoginModal from '../LoginModal';
import SignupModal from '../SignupModal';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/session';
import './Navbar.css';

const Navbar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const sessionUser = useSelector((state) => state.session.user);
	const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

	const handleLogout = async () => {
		await dispatch(logout());
		navigate('/');
	};

	return (
		<nav className='navbar'>
			<div className='navbar-logo'>
				<NavLink to='/' className='navbar-brand'>
					ProFolio
				</NavLink>
			</div>

			<div className='navbar-links'>
				{sessionUser ? (
					<>
						<NavLink to='/dashboard' className='navbar-link'>
							Dashboard
						</NavLink>
						<NavLink to='/settings' className='navbar-link'>
							Settings
						</NavLink>
						<button onClick={handleLogout} className='navbar-button'>
							Log Out
						</button>
					</>
				) : (
					<>
						<div className='navbar-link' id='signup-modal'>
							<button onClick={() => setIsSignupModalOpen(true)}>
								Sign Up
							</button>
							<ReactModal
								isOpen={isSignupModalOpen}
								onRequestClose={() => setIsSignupModalOpen(false)}
								ariaHideApp={false}>
								<SignupModal
									closeModal={() => setIsSignupModalOpen(false)}
								/>
							</ReactModal>
						</div>
						<div className='navbar-link' id='login-modal'>
							<button onClick={() => setIsLoginModalOpen(true)}>
								Log In
							</button>
							<ReactModal
								isOpen={isLoginModalOpen}
								onRequestClose={() => setIsLoginModalOpen(false)}
								ariaHideApp={false}>
								<LoginModal
									closeModal={() => setIsLoginModalOpen(false)}
								/>
							</ReactModal>
						</div>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
