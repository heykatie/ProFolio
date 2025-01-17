import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signup } from '../../../store/session'
import googleLogo from '../../../../../images/google.png';
import linkedinLogo from '../../../../../images/linkedin.png';
import githubLogo from '../../../../../images/github.png';
import { useModal } from '../../../context/ModalContext';
import LoginModal from '../LoginModal';
// import './SignupModal.css';
import '../SessionModals.css'

const SignupModal = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const sessionUser = useSelector((state) => state.session.user);
	const [serverErrors, setServerErrors] = useState([]);
	const [showPassword, setShowPassword] = useState(false);
	const { closeModal, setModalContent } = useModal();

	// Redirect if user is already logged in
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

	// Handle form submission
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = async (data) => {
		const { email, password, fullName, phone } = data;
		setServerErrors([]);

		const nameParts = fullName.trim().split(' ');
		const firstName = nameParts[0];
		const lastName = nameParts[1] || '';
		const username = `${firstName}${lastName}`;

		try {
			await dispatch(
				signup({ email, password, username, firstName, lastName, phone })
			);
			closeModal();
		} catch (err) {
			if (err.errors) {
				setServerErrors(err.errors);
			} else {
				const errData = await err.json();
				const error = new Error(errData.title || 'Invalid');
				error.status = err.status;
				error.errors = errData.errors || {};
				setServerErrors(error.errors);
			}
		}
	};

	// Open Login Modal
	const openLoginModal = () => {
		setModalContent(<LoginModal />);
	};

	// Toggle password visibility
	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	return (
		<div className='modal-container' id='signup'>
			<button onClick={closeModal} className='modal-close-button'>
				&times;
			</button>
			<div className='modal-header'>
				<h2 className='modal-title'>Sign Up</h2>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='auth-form'>
				{serverErrors.length > 0 && (
					<ul className={`form-error ${serverErrors ? 'show' : ''}`}>
						{serverErrors.map((error, idx) => (
							<li key={idx}>{error}</li>
						))}
					</ul>
				)}

				<div className='auth-form-group'>
					<input
						placeholder='Full Name'
						id='fullName'
						type='text'
						className='form-input'
						{...register('fullName', {
							required: 'Full name is required',
							validate: {
								twoWords: (value) =>
									value.trim().split(' ').length === 2 ||
									'Please enter your first and last name',
							},
						})}
					/>
					{errors.fullName && (
						<p className={`form-error ${errors.fullName ? 'show' : ''}`}>
							{errors.fullName.message}
						</p>
					)}
				</div>

				<div className='auth-form-group'>
					<input
						placeholder='Email'
						id='email'
						type='email'
						className='form-input'
						{...register('email', {
							required: 'Email is required',
							pattern: {
								value: /\S+@\S+\.\S+/,
								message: 'Please enter a valid email address',
							},
						})}
					/>
					{errors.email && (
						<p className={`form-error ${errors.email ? 'show' : ''}`}>
							{errors.email.message}
						</p>
					)}
				</div>

				<div className='auth-form-group'>
					<input
						id='phone'
						type='text'
						className='form-input'
						placeholder='Phone Number (Optional)'
						onFocus={(e) => (e.target.placeholder = '+1234567890')}
						onBlur={(e) =>
							(e.target.placeholder = 'Phone Number (Optional)')
						}
						{...register('phone', {
							pattern: {
								value: /^\+?[1-9]\d{1,14}$/,
								message: 'Please enter a valid phone number',
							},
						})}
					/>
					{errors.phone && (
						<p className={`form-error ${errors.phone ? 'show' : ''}`}>
							{errors.phone.message}
						</p>
					)}
				</div>

				<div className='auth-form-group'>
					<div className='password-wrapper'>
						<input
							placeholder='Password'
							id='password'
							type={showPassword ? 'text' : 'password'}
							className='form-input'
							{...register('password', {
								required: 'Password is required',
								minLength: {
									value: 8,
									message: 'Password must be at least 8 characters',
								},
								validate: {
									hasUppercase: (value) =>
										/[A-Z]/.test(value) ||
										'Password must contain at least one uppercase letter',
									hasDigit: (value) =>
										/\d/.test(value) ||
										'Password must contain at least one digit',
									noSpaces: (value) =>
										!/\s/.test(value) ||
										'Password must not contain spaces',
								},
							})}
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
							{errors.password.message}
						</p>
					)}
				</div>

				<button type='submit' className='modal-submit-button'>
					Create My Account
				</button>
			</form>

			<div className='social-login'>
				<p className='auth-divider'>
					-------------------------- Or sign up with
					--------------------------
				</p>
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

			<div className='signup-login-prompt'>
				Already have an account?{' '}
				<span className='signup-login-link' onClick={openLoginModal}>
					Log In
				</span>
			</div>
		</div>
	);
};

export default SignupModal;
