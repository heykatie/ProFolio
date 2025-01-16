import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../store/session';
import './SignupModal.css';

const SignupModal = ({ closeModal }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const sessionUser = useSelector((state) => state.session.user);
	const [serverErrors, setServerErrors] = useState([]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		if (sessionUser) navigate('/');
	}, [sessionUser, navigate]);

	const onSubmit = async (data) => {
		const { email, password, username, firstName, lastName } = data;
		setServerErrors([]);

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

	return (
		<div className='signup-modal'>
			<div className='signup-modal-content'>
				<button onClick={closeModal} className='signup-modal-close'>
					&times;
				</button>
				<h2>Create an Account</h2>
				<form onSubmit={handleSubmit(onSubmit)} className='signup-form'>
					{serverErrors.length > 0 && (
						<ul className='server-errors'>
							{serverErrors.map((error, idx) => (
								<li key={idx}>{error}</li>
							))}
						</ul>
					)}
					{/* {serverErrors.length > 0 && (
						<div className='server-errors'>
							{Object.keys(serverErrors).map((field, idx) => (
								<div key={idx} className='error-message'>
									<strong>{field}:</strong> {serverErrors[field]}
								</div>
							))}
						</div>
					)} */}
					{/* {serverErrors.length > 0 && (
						<div className='server-errors'>
							{serverErrors.map((error, idx) => (
								<p key={idx} className='error-message'>
									{error}
								</p>
							))}
						</div>
					)} */}
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
						<label htmlFor='username'>Username</label>
						<input
							id='username'
							type='text'
							{...register('username', {
								required: 'Username is required',
								minLength: {
									value: 4,
									message: 'Username must be at least 4 characters',
								},
							})}
						/>
						{errors.username && (
							<p className='form-error'>{errors.username.message}</p>
						)}
						{serverErrors.username && (
							<p className='form-error'>{serverErrors.username}</p>
						)}
					</div>

					<div className='form-group'>
						<label htmlFor='firstName'>First Name</label>
						<input
							id='firstName'
							type='text'
							{...register('firstName', {
								required: 'First name is required',
								maxLength: {
									value: 50,
									message:
										'First name must be less than 50 characters',
								},
							})}
						/>
						{errors.firstName && (
							<p className='form-error'>{errors.firstName.message}</p>
						)}
						{serverErrors.firstName && (
							<p className='form-error'>{serverErrors.firstName}</p>
						)}
					</div>

					<div className='form-group'>
						<label htmlFor='lastName'>Last Name</label>
						<input
							id='lastName'
							type='text'
							{...register('lastName', {
								required: 'Last name is required',
								maxLength: {
									value: 50,
									message: 'Last name must be less than 50 characters',
								},
							})}
						/>
						{errors.lastName && (
							<p className='form-error'>{errors.lastName.message}</p>
						)}
						{serverErrors.lastName && (
							<p className='form-error'>{serverErrors.lastName}</p>
						)}
					</div>

					<div className='form-group'>
						<label htmlFor='password'>Password</label>
						<input
							id='password'
							type='password'
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
						{errors.password && (
							<p className='form-error'>{errors.password.message}</p>
						)}
						{serverErrors.password && (
							<p className='form-error'>{serverErrors.password}</p>
						)}
					</div>

					<button type='submit' className='signup-submit'>
						Sign Up
					</button>
				</form>
			</div>
		</div>
	);
};

export default SignupModal;
