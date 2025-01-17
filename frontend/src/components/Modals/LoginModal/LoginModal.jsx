import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {login, signup} from '../../../store/session';
import googleLogo from '../../../../../images/google.png';
import linkedinLogo from '../../../../../images/linkedin.png';
import githubLogo from '../../../../../images/github.png';
import { useModal } from '../../../context/ModalContext';
import SignupModal from '../SignupModal';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
// import './LoginModal.css';
import '../SessionModals.css';

const LoginModal = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const sessionUser = useSelector((state) => state.session.user);
	const [showPassword, setShowPassword] = useState(false);
	const [credential, setCredential] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});
	const { closeModal, setModalContent } = useModal();

	// Open the Sign-Up modal
	const openSignupModal = () => {
		setModalContent(<SignupModal />);
	};

	// Redirect user if already logged in
	useEffect(() => {
		if (sessionUser) navigate('/');
	}, [sessionUser, navigate]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				closeModal();
			}
		};
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [closeModal]);

	// Handle login submission
	const handleLogin = async (e) => {
		e.preventDefault();
		setErrors({});

		try {
			await dispatch(login({ credential, password }));
			closeModal();
		} catch (res) {
			if (res.json) {
				const data = await res.json();
				if (data && data.errors) {
					setErrors(data.errors);
				}
			}
		}
	};

	// Handle demo login
	const demoLogin = async (e) => {
		e.preventDefault();
		const demoCredential = 'Demo-lition';
		const demoPassword = 'Password123!';
		try {
			await dispatch(
				login({
					credential: demoCredential,
					password: demoPassword,
				})
			);
			closeModal();
		} catch (res) {
			const data = await res.json();
			if (data && data.message) {
				setErrors(data);
			}
		}
	};

		const togglePasswordVisibility = () => {
			setShowPassword((prev) => !prev);
		};

	return (
		<div className='modal-container' id='login'>
			<button onClick={closeModal} className='modal-close-button'>
				&times;
			</button>
			<div className='modal-header'>
				<h2 className='modal-title'>Log In</h2>
			</div>

			{/* Login Form */}
			<form onSubmit={handleLogin} className='auth-form'>
				<div className='auth-form-group'>
					<input
						placeholder='Username or Email'
						type='text'
						id='credential'
						className='form-input'
						value={credential}
						onChange={(e) => setCredential(e.target.value)}
						required
					/>
					{errors.credential && (
						<p className={`form-error ${errors.credential ? 'show' : ''}`}>
							{errors.credential}
						</p>
					)}
				</div>

				<div className='auth-form-group'>
					<div className='password-wrapper'>
						<input
							placeholder='Password'
							type={showPassword ? 'text' : 'password'}
							id='password'
							className='form-input'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<span
							role='button'
							aria-label='Toggle password visibility'
							className='password-toggle'
							onClick={togglePasswordVisibility}>
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</span>
					</div>
					{errors.password && (
						<p className={`form-error ${errors.password ? 'show' : ''}`}>
							{errors.password}
						</p>
					)}
					{/* Server Errors */}
					{errors.general && (
						<ul className='login-server-errors'>
							<li>{errors.general}</li>
						</ul>
					)}
				</div>

				<button type='submit' className='modal-submit-button'>
					Log In
				</button>
			</form>

			{/* Demo Login */}
			<button className='demo-button' onClick={demoLogin}>
				Demo Account
			</button>

			{/* Divider */}
			<p className='auth-divider'>
				-------------------------- Or log in with --------------------------
			</p>

			{/* Social Login Options */}
			<div className='social-login'>
				<div className='social-buttons'>
					<a href='/api/auth/google' className='social-btn google-btn'>
						<img src={googleLogo} alt='Google' />
					</a>
					<a href='/api/auth/linkedin' className='social-btn linkedin-btn'>
						<img src={linkedinLogo} alt='LinkedIn' />
					</a>
					<a href='/api/auth/github' className='social-btn github-btn'>
						<img src={githubLogo} alt='GitHub' />
					</a>
				</div>
			</div>

			{/* Sign-Up Prompt */}
			<div className='signup-login-prompt'>
				{"Don't have an account?"}{' '}
				<span className='signup-login-link' onClick={openSignupModal}>
					{' ' + 'Sign Up'}
				</span>
			</div>
		</div>
	);
};

export default LoginModal;
