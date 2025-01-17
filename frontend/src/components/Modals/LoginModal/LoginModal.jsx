import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../store/session';
import googleLogo from '../../../../../images/google.png';
import linkedinLogo from '../../../../../images/linkedin.png';
import githubLogo from '../../../../../images/github.png';
import { useModal } from '../../../context/ModalContext';
import SignupModal from '../SignupModal';
import './LoginModal.css';

const LoginModal = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const sessionUser = useSelector((state) => state.session.user);
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

	return (
		<div className='login-modal-container'>
			<button onClick={closeModal} className='login-modal-close-button'>
				&times;
			</button>
			<div className='login-modal'>
				<div className='login-modal-header'>
					<h2 className='login-modal-title'>Log In</h2>
				</div>

				{/* Server Errors */}
				{errors.general && (
					<ul className='login-server-errors'>
						<li>{errors.general}</li>
					</ul>
				)}

				{/* Social Login Options */}
				<div className='login-social-login'>
					<div className='login-social-buttons'>
						<a
							href='/api/auth/google'
							className='login-social-btn google-btn'>
							<img src={googleLogo} alt='Google' />
						</a>
						<a
							href='/api/auth/linkedin'
							className='login-social-btn linkedin-btn'>
							<img src={linkedinLogo} alt='LinkedIn' />
						</a>
						<a
							href='/api/auth/github'
							className='login-social-btn github-btn'>
							<img src={githubLogo} alt='GitHub' />
						</a>
					</div>
				</div>

				{/* Divider */}
				<p className='auth-divider'>
					--------------------- OR ---------------------
				</p>

				{/* Login Form */}
				<form onSubmit={handleLogin} className='login-form'>
					<div className='login-form-group'>
						<label htmlFor='credential' className='login-label'>
							Username or Email
						</label>
						<input
							type='text'
							id='credential'
							className='login-input'
							value={credential}
							onChange={(e) => setCredential(e.target.value)}
							required
						/>
						{errors.credential && (
							<p className='form-error'>{errors.credential}</p>
						)}
					</div>

					<div className='login-form-group'>
						<label htmlFor='password' className='login-label'>
							Password
						</label>
						<input
							type='password'
							id='password'
							className='login-input'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						{errors.password && (
							<p className='form-error'>{errors.password}</p>
						)}
					</div>

					<button type='submit' className='modal-submit-button'>
						Log In
					</button>
				</form>

				{/* Demo Login */}
				<button className='login-demo-button' onClick={demoLogin}>
					Demo Account
				</button>

				{/* Sign-Up Prompt */}
				<p className='login-signup-prompt'>
					Don`t have an account?{' '}
					<span className='login-signup-link' onClick={openSignupModal}>
						Sign Up
					</span>
				</p>
			</div>
		</div>
	);
};

export default LoginModal;
