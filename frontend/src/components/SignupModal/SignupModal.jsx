import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../store/session';
import googleLogo from '../../../../images/google.png';
import linkedinLogo from '../../../../images/linkedin.png';
import githubLogo from '../../../../images/github.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useModal } from '../../context/ModalContext';
import LoginModal from '../LoginModal';
import './SignupModal.css';

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
		<div className='signup-modal-container'>
			<div className='signup-modal'>
				<div className='signup-modal-header'>
					<button
						onClick={closeModal}
						className='signup-modal-close-button'>
						&times;
					</button>
					<h2 className='signup-modal-title'>Sign Up</h2>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className='signup-form'>
					{serverErrors.length > 0 && (
						<ul className='signup-form-errors'>
							{serverErrors.map((error, idx) => (
								<li key={idx}>{error}</li>
							))}
						</ul>
					)}

					<div className='signup-form-group'>
						<label htmlFor='fullName' className='signup-label'>
							Full Name
						</label>
						<input
							id='fullName'
							type='text'
							className='signup-input'
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
							<p className='signup-error'>{errors.fullName.message}</p>
						)}
					</div>

					<div className='signup-form-group'>
						<label htmlFor='email' className='signup-label'>
							Email
						</label>
						<input
							id='email'
							type='email'
							className='signup-input'
							{...register('email', {
								required: 'Email is required',
								pattern: {
									value: /\S+@\S+\.\S+/,
									message: 'Please enter a valid email address',
								},
							})}
						/>
						{errors.email && (
							<p className='signup-error'>{errors.email.message}</p>
						)}
					</div>

					<div className='signup-form-group'>
						<label htmlFor='phone' className='signup-label'>
							Phone Number (Optional)
						</label>
						<input
							id='phone'
							type='text'
							className='signup-input'
							placeholder='+1234567890'
							{...register('phone', {
								pattern: {
									value: /^\+?[1-9]\d{1,14}$/,
									message:
										'Please enter a valid phone number in E.164 format',
								},
							})}
						/>
						{errors.phone && (
							<p className='signup-error'>{errors.phone.message}</p>
						)}
					</div>

					<div className='signup-form-group'>
						<label htmlFor='password' className='signup-label'>
							Password
						</label>
						<div className='signup-password-wrapper'>
							<input
								id='password'
								type={showPassword ? 'text' : 'password'}
								className='signup-input'
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
								className='signup-password-toggle'
								onClick={togglePasswordVisibility}>
								{showPassword ? <FaEyeSlash /> : <FaEye />}
							</span>
						</div>
						{errors.password && (
							<p className='signup-error'>{errors.password.message}</p>
						)}
					</div>

					<button type='submit' className='signup-submit-button'>
						Create My Account
					</button>
				</form>

				<div className='signup-social-login'>
					<p className='signup-divider'>Or sign up with</p>
					<div className='signup-social-buttons'>
						<a
							href='/api/auth/google'
							className='signup-social-btn google-btn'>
							<img src={googleLogo} alt='Google' />
						</a>
						<a
							href='/api/auth/linkedin'
							className='signup-social-btn linkedin-btn'>
							<img src={linkedinLogo} alt='LinkedIn' />
						</a>
						<a
							href='/api/auth/github'
							className='signup-social-btn github-btn'>
							<img src={githubLogo} alt='GitHub' />
						</a>
					</div>
				</div>

				<p className='signup-login-prompt'>
					Already have an account?{' '}
					<span className='signup-login-link' onClick={openLoginModal}>
						Log In
					</span>
				</p>
			</div>
		</div>
	);
};

export default SignupModal;
