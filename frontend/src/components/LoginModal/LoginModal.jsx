import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/session';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';

const LoginModal = ({ closeModal }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const sessionUser = useSelector((state) => state.session.user);
	const [credential, setCredential] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (sessionUser) navigate('/');
	}, [sessionUser, navigate]);

	const handleSubmit = async (e) => {
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
			<form onSubmit={handleSubmit} className='login-form'>
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
				Log in as Demo User
			</a>
		</div>
	);
};

export default LoginModal;