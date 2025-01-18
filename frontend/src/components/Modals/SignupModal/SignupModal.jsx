import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signup } from '../../../store/session';
import googleLogo from '../../../../../images/google.png';
import linkedinLogo from '../../../../../images/linkedin.png';
import githubLogo from '../../../../../images/github.png';
import useModal from '/Users/ktl/aA/24week/projects/capstone/ProFolio/frontend/src/context/useModal.js';
import LoginModal from '../LoginModal';

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

	// Close modal on Escape key press
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

	// Form submission handler
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
				setServerErrors(errData.errors || []);
			}
		}
	};

	// Toggle password visibility
	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

	// Open Login Modal
	const openLoginModal = () => setModalContent(<LoginModal />);

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
						Sign Up
					</h2>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					{/* Server Errors */}
					{serverErrors.length > 0 && (
						<ul className='error-message space-y-1'>
							{serverErrors.map((error, idx) => (
								<li key={idx}>{error}</li>
							))}
						</ul>
					)}

					{/* Full Name */}
					<div>
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
						<div className='h-3'>
							{errors.fullName && (
								<p className='error-message'>
									{errors.fullName.message}
								</p>
							)}
						</div>
					</div>

					{/* Email */}
					<div>
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
						<div className='h-3'>
							{errors.email && (
								<p className='error-message'>
									{errors.email.message}
								</p>
							)}
						</div>
					</div>

					{/* Phone Number */}
					<div>
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
						<div className='h-3'>
						{errors.phone && (
							<p className='error-message'>
								{errors.phone.message}
							</p>
						)}
					</div>
					</div>

					{/* Password */}
					<div className='relative'>
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
							className='absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer'
							onClick={togglePasswordVisibility}>
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</span>
						<div className='h-3'>
						{errors.password && (
							<p className='error-message'>
								{errors.password.message}
							</p>
						)}
					</div>
					</div>

					{/* Submit Button */}
					<button type='submit' className='btn-primary w-full'>
						Create My Account
					</button>
				</form>

				<div className='flex items-center my-6'>
					<hr className='flex-grow border-t-2 border-gray-300 dark:border-gray-600' />
					<span className='px-4 text-sm text-text-primary dark:text-text-primary-dark'>
						Or sign up with
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

				{/* Login Prompt */}
				<div className='text-sm text-center mt-6'>
					<span className='text-text-primary dark:text-text-primary-dark'>
						Already have an account?{' '}
					</span>
					<button
						onClick={openLoginModal}
						className='text-primary hover:text-primary-hover dark:text-primary-dark dark:hover:text-primary-darkhover font-semibold'>
						Log In
					</button>
				</div>
			</div>
		</div>
	);
};

export default SignupModal;
