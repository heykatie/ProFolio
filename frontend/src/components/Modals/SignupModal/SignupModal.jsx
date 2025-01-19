import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signup } from '../../../store/user';
import googleLogo from '../../../../../images/google.png';
import linkedinLogo from '../../../../../images/linkedin.png';
import githubLogo from '../../../../../images/github.png';
import useModal from '/Users/ktl/aA/24week/projects/capstone/ProFolio/frontend/src/context/useModal.js';
import LoginModal from '../LoginModal';
import PhoneInput from '../../PhoneInput/PhoneInput';

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

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm();

	const onSubmit = async (data) => {
		const { email, password, fullName, phone } = data;
		setServerErrors([]);

		const [firstName, ...lastNameParts] = fullName.trim().split(' ');
		const lastName = lastNameParts.join(' ');

		try {
			const user = await dispatch(
				signup({
					email,
					password,
					username: `${firstName}${lastName}`,
					firstName,
					lastName,
					phone,
				})
			);
			if (user) closeModal();
		} catch (err) {
			setServerErrors(
				err.errors
					? Object.values(err.errors)
					: ['An unexpected error occurred.']
			);
		}
	};

	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

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

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					{serverErrors.length > 0 && (
						<ul className='error-message space-y-1'>
							{serverErrors.map((error, idx) => (
								<li key={idx}>{error}</li>
							))}
						</ul>
					)}

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
										value.trim().split(' ').length >= 2 ||
										'Please enter your first and last name',
								},
							})}
						/>
						{errors.fullName && (
							<p className='error-message'>{errors.fullName.message}</p>
						)}
					</div>

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
						{errors.email && (
							<p className='error-message'>{errors.email.message}</p>
						)}
					</div>

					<div>
						<PhoneInput
							value={watch('phone') || ''}
							onChange={(value) => setValue('phone', value)}
						/>
					</div>

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
						{errors.password && (
							<p className='error-message'>{errors.password.message}</p>
						)}
					</div>

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
