import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteProfile, updateProfile, getUserById } from '../../store/user';
import PhoneInput from '../PhoneInput';

const ProfilePage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const sessionUser = useSelector((state) => state.session.user);

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		location: '',
		bio: '',
		pronouns: '',
		career: '',
		socialLink: '',
	});
	const [errors, setErrors] = useState([]);
	const [successMessage, setSuccessMessage] = useState('');

	useEffect(() => {
		if (sessionUser) {
			dispatch(getUserById(sessionUser.id)).then((data) => {
				setFormData({
					firstName: data.firstName || '',
					lastName: data.lastName || '',
					email: data.email || '',
					phone: data.phone || '',
					location: data.location || '',
					bio: data.bio || '',
					pronouns: data.pronouns || '',
					career: data.career || '',
					socialLink: data.socialLink || '',
				});
			});
		} else {
			navigate('/');
		}
	}, [dispatch, sessionUser, navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors([]);
		setSuccessMessage('');

		try {
			await dispatch(updateProfile({ id: sessionUser.id, ...formData }));
			setSuccessMessage('Profile updated successfully!');
		} catch (err) {
			if (err.errors) {
				setErrors(err.errors);
			} else if (err.response) {
				const errData = await err.response.json();
				setErrors(errData.errors || []);
			} else {
				setErrors(['An unknown error occurred.']);
			}
		}
	};

	const handleDelete = async () => {
		if (
			window.confirm(
				'Are you sure you want to delete your account? This action cannot be undone.'
			)
		) {
			try {
				await dispatch(deleteProfile(sessionUser.id));
				navigate('/');
			} catch (err) {
				setErrors(['Failed to delete account. Please try again later.']);
			}
		}
	};

	return (
		<div className='container mx-auto px-4 py-8 max-w-4xl'>
			<h1 className='text-3xl font-heading font-bold mb-6'>Your Profile</h1>
			{errors.length > 0 && (
				<ul className='error-message space-y-2 mb-4'>
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
			)}
			{successMessage && (
				<p className='text-success font-medium mb-4'>{successMessage}</p>
			)}
			<form
				onSubmit={handleSubmit}
				className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
				<div>
					<label htmlFor='firstName' className='block font-medium mb-1'>
						First Name
					</label>
					<input
						id='firstName'
						name='firstName'
						type='text'
						value={formData.firstName || ''}
						onChange={handleChange}
						className='form-input'
						required
					/>
				</div>
				<div>
					<label htmlFor='lastName' className='block font-medium mb-1'>
						Last Name
					</label>
					<input
						id='lastName'
						name='lastName'
						type='text'
						value={formData.lastName || ''}
						onChange={handleChange}
						className='form-input'
						required
					/>
				</div>
				<div>
					<label htmlFor='email' className='block font-medium mb-1'>
						Email
					</label>
					<input
						id='email'
						name='email'
						type='email'
						value={formData.email || ''}
						onChange={handleChange}
						className='form-input'
						required
					/>
				</div>
				<div>
					<label htmlFor='phone' className='block font-medium mb-1'>
						Phone Number
					</label>
					<PhoneInput
						phone={formData.phone}
						value={formData.phone || ''}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor='location' className='block font-medium mb-1'>
						Location
					</label>
					<input
						id='location'
						name='location'
						type='text'
						value={formData.location || ''}
						onChange={handleChange}
						className='form-input'
					/>
				</div>
				<div>
					<label htmlFor='bio' className='block font-medium mb-1'>
						Bio
					</label>
					<textarea
						id='bio'
						name='bio'
						value={formData.bio || ''}
						onChange={handleChange}
						className='form-input'
					/>
				</div>
				<div>
					<label htmlFor='pronouns' className='block font-medium mb-1'>
						Pronouns
					</label>
					<input
						id='pronouns'
						name='pronouns'
						type='text'
						value={formData.pronouns || ''}
						onChange={handleChange}
						className='form-input'
					/>
				</div>
				<div>
					<label htmlFor='career' className='block font-medium mb-1'>
						Career
					</label>
					<input
						id='career'
						name='career'
						type='text'
						value={formData.career || ''}
						onChange={handleChange}
						className='form-input'
					/>
				</div>
				<div className='sm:col-span-2'>
					<label htmlFor='socialLink' className='block font-medium mb-1'>
						Social Link
					</label>
					<input
						id='socialLink'
						name='socialLink'
						type='url'
						value={formData.socialLink || ''}
						onChange={handleChange}
						className='form-input'
					/>
				</div>
				<div className='sm:col-span-2 flex justify-between'>
					<button
						type='submit'
						className='btn-primary px-6 py-2 font-medium text-lg'>
						Update Profile
					</button>
					<button
						type='button'
						onClick={handleDelete}
						className='btn-danger px-6 py-2 font-medium text-lg'>
						Delete Account
					</button>
				</div>
			</form>
		</div>
	);
};

export default ProfilePage;
