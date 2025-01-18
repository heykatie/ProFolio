import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../store/session';
import googleLogo from '../../../../../images/google.png';
import linkedinLogo from '../../../../../images/linkedin.png';
import githubLogo from '../../../../../images/github.png';
import { useModal } from '../../../context/ModalContext';
import SignupModal from '../SignupModal';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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

	// Handle keydown for escape key
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') closeModal();
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
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
				if (data && data.errors) setErrors(data.errors);
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
				login({ credential: demoCredential, password: demoPassword })
			);
			closeModal();
		} catch (res) {
			const data = await res.json();
			if (data && data.message) setErrors(data);
		}
	};

	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

	return (
		<div
			className='modal-overlay'
			onClick={(e) => {
				if (e.target === e.currentTarget) closeModal();
			}}>
			<div className='modal-content'>
				<button
					onClick={closeModal}
					className='text-xl font-bold text-error hover:text-error-dark self-end'>
					&times;
				</button>

				<div className='text-center mb-6'>
					<h2 className='text-2xl font-heading text-text-primary dark:text-text-primary-dark'>
						Log In
					</h2>
				</div>

				{/* Login Form */}
				<form onSubmit={handleLogin} className='space-y-4'>
					<div>
						<input
							placeholder='Username or Email'
							type='text'
							id='credential'
							className='form-input'
							value={credential}
							onChange={(e) => setCredential(e.target.value)}
							required
						/>
						<div className='h-2'>
							{errors.credential && (
								<p className='text-error text-sm mt-1'>
									{errors.credential}
								</p>
							)}
						</div>
					</div>

					<div>
						<div className='relative'>
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
								className='absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer'
								onClick={togglePasswordVisibility}>
								{showPassword ? <FaEyeSlash /> : <FaEye />}
							</span>
						</div>
						<div className='h-2'>
						{errors.password && (
							<p className='text-error text-sm mt-1'>
								{errors.password}
							</p>
						)}
						{/* Server Errors */}
						{errors.general && (
							<p className='text-error text-sm mt-2'>{errors.general}</p>
						)}
						</div>
					</div>

					<button type='submit' className='btn-primary w-full'>
						Log In
					</button>
				</form>

				{/* Demo Login */}
				<button className='btn-secondary w-full mt-4' onClick={demoLogin}>
					Demo Account
				</button>

				<div className='flex items-center my-6'>
					<hr className='flex-grow border-t-2 border-gray-300 dark:border-gray-600' />
					<span className='px-4 text-sm text-text-primary dark:text-text-primary-dark'>
						Or log in with
					</span>
					<hr className='flex-grow border-t-2 border-gray-300 dark:border-gray-600' />
				</div>

				{/* Social Login */}
				<div className='flex justify-center space-x-4'>
					<a
						href='/api/auth/google'
						className='flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md transition-transform hover:scale-110'>
						<img src={googleLogo} alt='Google' className='w-6 h-6' />
					</a>
					<a
						href='/api/auth/linkedin'
						className='flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md transition-transform hover:scale-110'>
						<img src={linkedinLogo} alt='LinkedIn' className='w-6 h-6' />
					</a>
					<a
						href='/api/auth/github'
						className='flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md transition-transform hover:scale-110'>
						<img src={githubLogo} alt='GitHub' className='w-6 h-6' />
					</a>
				</div>

				{/* Sign-Up Prompt */}
				<div className='text-sm text-center mt-6'>
					<span className='text-text-primary dark:text-text-primary-dark'>
						{"Don't have an account? "}
					</span>
					<button
						onClick={openSignupModal}
						className='text-primary hover:text-primary-hover dark:text-primary-dark dark:hover:text-primary-darkhover font-semibold'>
						Sign Up
					</button>
				</div>
			</div>
		</div>
	);
};

export default LoginModal;
