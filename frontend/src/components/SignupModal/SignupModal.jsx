import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../store/session';
import googleLogo from '../../../../images/google.png';
import linkedinLogo from '../../../../images/linkedin.png';
import githubLogo from '../../../../images/github.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './SignupModal.css';

const SignupModal = ({ closeModal }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const sessionUser = useSelector((state) => state.session.user);
	const [serverErrors, setServerErrors] = useState([]);
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		if (sessionUser) navigate('/');
	}, [sessionUser, navigate]);

	const onSubmit = async (data) => {
		const { email, password, fullName } = data;
		setServerErrors([]);

		const nameParts = fullName.trim().split(' ');
		const firstName = nameParts[0];
		const lastName = nameParts[1] || '';
		const username = firstName+lastName;

		try {
			await dispatch(
				signup({ email, password, username, firstName, lastName })
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
        setServerErrors(error.errors)
      }
		}
	};

	const switchToLogin = () => {
		navigate('/login');
	}

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};


	return (
		<div className='signup-modal'>
			<div className='signup-modal-content'>
				<button onClick={closeModal} className='signup-modal-close'>
					&times;
				</button>
				<h2>Sign Up</h2>
				<form onSubmit={handleSubmit(onSubmit)} className='signup-form'>
					{serverErrors.length > 0 && (
						<ul className='server-errors'>
							{serverErrors.map((error, idx) => (
								<li key={idx}>{error}</li>
							))}
						</ul>
					)}

					<div className='form-group'>
						<label htmlFor='fullName'>Full Name</label>
						<input
							id='fullName'
							type='text'
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
							<p className='form-error'>{errors.fullName.message}</p>
						)}
						{serverErrors.firstName && (
							<p className='form-error'>{serverErrors.firstName}</p>
						)}
						{serverErrors.lastName && (
							<p className='form-error'>{serverErrors.lastName}</p>
						)}
					</div>

					<div className='form-group'>
						<label htmlFor='email'>Email</label>
						<input
							id='email'
							type='email'
							{...register('email', {
								required: 'Email is required',
								pattern: {
									value: /\S+@\S+\.\S+/,
									message: 'Please enter a valid email address',
								},
							})}
						/>
						{errors.email && (
							<p className='form-error'>{errors.email.message}</p>
						)}
						{serverErrors.email && (
							<p className='form-error'>{serverErrors.email}</p>
						)}
					</div>

					<div className='form-group'>
						<label htmlFor='password'>Password</label>
						<div className='password-wrapper'>
							<input
								id='password'
								type={showPassword ? 'text' : 'password'}
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
							<p className='form-error'>{errors.password.message}</p>
						)}
						{serverErrors.password && (
							<p className='form-error'>{serverErrors.password}</p>
						)}
					</div>

					<button type='submit' className='signup-submit'>
						Create My Account
					</button>
				</form>
				<div className='social-login'>
					<p>or continue with</p>
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
				<p>
					Already have an account?{' '}
					<span onClick={switchToLogin}>Log In</span>
				</p>
			</div>
		</div>
	);
};

export default SignupModal;


{
	/* <div className='form-group'>
	<label htmlFor='username'>Username</label>
	<input
		id='username'
		type='text'
		{...register('username', {
			minLength: {
				value: 4,
				message: 'Username must be at least 4 characters',
			},
			validate: {
				notEmail: (value) =>
					!/\S+@\S+\.\S+/.test(value) ||
					'Username cannot be an email address',
			},
		})}
	/>
	{errors.username && (
		<p className='form-error'>{errors.username.message}</p>
	)}
	{serverErrors.username && (
		<p className='form-error'>{serverErrors.username}</p>
	)}
</div> */
}