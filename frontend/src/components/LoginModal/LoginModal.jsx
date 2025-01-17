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
		<div className='login-modal'>
			<h2>Log In</h2>
			{errors.general && (
				<ul className='server-errors'>
					<li>{errors.general}</li>
				</ul>
			)}

			<div className='social-login'>
				<div className='social-buttons'>
					<a href='/api/auth/google' className='social-btn google'>
						<img src={googleLogo} alt='Google' />
					</a>
					<a href='/api/auth/linkedin' className='social-btn linkedin'>
						<img src={linkedinLogo} alt='LinkedIn' />
					</a>
					<a href='/api/auth/github' className='social-btn github'>
						<img src={githubLogo} alt='GitHub' />
					</a>
				</div>
			</div>

			<p>--------------------- OR ---------------------</p>

			<form onSubmit={handleLogin} className='login-form'>
				<div className='form-group'>
					<label htmlFor='credential'>Username or Email</label>
					<input
						type='text'
						id='credential'
						value={credential}
						onChange={(e) => setCredential(e.target.value)}
						required
					/>
					{errors.credential && (
						<p className='error'>{errors.credential}</p>
					)}
				</div>

				<div className='form-group'>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						id='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					{errors.password && <p className='error'>{errors.password}</p>}
				</div>

				<button type='submit' className='submit-button'>
					Log In
				</button>
				{errors.general && (
					<p className='error general-error'>{errors.general}</p>
				)}
			</form>

			<button className='close-modal-button' onClick={closeModal}>
				Close
			</button>

			<a href='#' onClick={demoLogin} id='demo-login' className='demo-link'>
				Demo Account
			</a>

			<p className='signup-prompt'>
				Don`t have an account?{' '}
				<span className='signup-link' onClick={openSignupModal}>
					Sign Up
				</span>
			</p>
		</div>
	);
};

export default LoginModal;