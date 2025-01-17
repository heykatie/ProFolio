import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/session';
import { useNavigate } from 'react-router-dom';
import googleLogo from '../../../../images/google.png';
import linkedinLogo from '../../../../images/linkedin.png';
import githubLogo from '../../../../images/github.png';
import './LoginModal.css';

const LoginModal = ({ closeModal, openSignupModal }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const sessionUser = useSelector((state) => state.session.user);
	const [credential, setCredential] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (sessionUser) navigate('/');
	}, [sessionUser, navigate]);

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

	const demoLogin = (e) => {
		e.stopPropagation();
		const demoCredential = 'Demo-lition';
		const demoPassword = 'Password123!';
		return dispatch(
			login({
				credential: demoCredential,
				password: demoPassword,
			})
		)
			.then(closeModal)
			.catch(async (res) => {
				const data = await res.json();
				if (data && data.message) {
					setErrors(data);
				}
			});
	};

	return (
		<div className='login-modal-container'>
			<div className='login-modal'>
				<h2 className='login-modal-title'>Log In</h2>
				{errors.general && (
					<ul className='login-server-errors'>
						<li>{errors.general}</li>
					</ul>
				)}

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

				<p className='login-divider'>
					--------------------- OR ---------------------
				</p>

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
							<p className='login-error'>{errors.credential}</p>
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
							<p className='login-error'>{errors.password}</p>
						)}
					</div>

					<button type='submit' className='login-submit-button'>
						Log In
					</button>
					{errors.general && (
						<p className='login-error login-general-error'>
							{errors.general}
						</p>
					)}
				</form>

				<button className='login-close-button' onClick={closeModal}>
					Close
				</button>

				<a href='#' onClick={demoLogin} className='login-demo-link'>
					Demo Account
				</a>

				<p className='login-signup-prompt'>
					Don’t have an account?{' '}
					<span className='login-signup-link' onClick={openSignupModal}>
						Sign Up
					</span>
				</p>
			</div>
		</div>
	);
};

export default LoginModal;
