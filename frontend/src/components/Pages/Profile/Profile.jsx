import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteAccount, editProfile, getUser } from '../../../store/profile';
import PhoneInput from '/Users/ktl/aA/24week/projects/capstone/ProFolio/frontend/src/components/PhoneInput/PhoneInput.jsx';
import { logout } from '../../../store/session'
import FileUpload from '../../FileUpload'

const Profile = () => {
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
		socialLinks: '',
		resumeUrl: '',
		linkedinUrl: '',
		githubUrl: '',
		username: '',
		themePreference: '',
		timezone: '',
	});

	const [errors, setErrors] = useState([]);
	const [successMessage, setSuccessMessage] = useState('');

	useEffect(() => {
		if (sessionUser) {
			dispatch(getUser(sessionUser.id)).then((data) => {
				setFormData({
					firstName: data.firstName || '',
					lastName: data.lastName || '',
					email: data.email || '',
					phone: data.phone || '',
					location: data.location || '',
					timezone: data.timezone || '',
					bio: data.bio || '',
					themePreference: data.themePreference || '',
					pronouns: data.pronouns || '',
					career: data.career || '',
					socialLinks: data.socialLinks || '',
					username: data.username || '',
					githubUrl: data.githubUrl || null,
					linkedinUrl: data.linkedinUrl || null,
					resumeUrl: data.resumeUrl || null,
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
			await dispatch(editProfile({ userId: sessionUser.id, updateData: formData }));
			setSuccessMessage('Profile updated successfully!');
		} catch (err) {
			setErrors(
				Object.entries(err.errors || {}).map(
					([field, message]) => `${field}: ${message}`
				)
			);
		}
	};

	const handleDelete = async () => {
		if (
			window.confirm(
				'Are you sure you want to delete your account? This action cannot be undone.'
			)
		) {
			try {
				await dispatch(deleteAccount(sessionUser.id));
				await dispatch(logout(sessionUser.id))
				navigate('/');
			} catch (err) {
				console.error(err)
				setErrors(['Failed to delete account. Please try again later.']);
			}
		}
	};

	return (
		<div className='container mx-auto px-4 py-8 max-w-4xl'>
			<h1 className='text-3xl font-heading font-bold mb-6'>Your Profile</h1>
			<FileUpload />
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
					<label htmlFor='username' className='block font-medium mb-1'>
						Username
					</label>
					<input
						id='username'
						name='username'
						type='username'
						value={formData.username || ''}
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
					<label htmlFor='timezone' className='block font-medium mb-1'>
						Preferred Timezone
					</label>
					<input
						id='timezone'
						name='timezone'
						type='text'
						value={formData.timezone || ''}
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
					<label
						htmlFor='themePreference'
						className='block font-medium mb-1'>
						Theme Preference
					</label>
					<textarea
						id='themePreference'
						name='themePreference'
						value={formData.themePreference || ''}
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
				<div>
					<label htmlFor='githubUrl' className='block font-medium mb-1'>
						Github Link
					</label>
					<input
						id='githubUrl'
						name='githubUrl'
						type='url'
						value={formData.githubUrl || null}
						onChange={handleChange}
						className='form-input'
					/>
				</div>
				<div>
					<label htmlFor='linkedinUrl' className='block font-medium mb-1'>
						LinkedIn Link
					</label>
					<input
						id='linkedinUrl'
						name='linkedinUrl'
						type='url'
						value={formData.linkedinUrl || null}
						onChange={handleChange}
						className='form-input'
					/>
				</div>
				<div>
					<label htmlFor='resumeUrl' className='block font-medium mb-1'>
						Resume Link
					</label>
					<input
						id='resumeUrl'
						name='resumeUrl'
						type='url'
						value={formData.resumeUrl || null}
						onChange={handleChange}
						className='form-input'
					/>
				</div>
				<div className='sm:col-span-2'>
					<label htmlFor='socialLinks' className='block font-medium mb-1'>
						Social Links
					</label>
					<input
						id='socialLinks'
						name='socialLinks'
						type='url'
						value={formData.socialLinks || ''}
						onChange={handleChange}
						className='form-input'
					/>
				</div>
				{errors.length > 0 && (
					<ul className='error-message space-y-1'>
						{errors.map((error, idx) => (
							<li key={idx}>{error}</li>
						))}
					</ul>
				)}
				{successMessage && (
					<p className='text-success font-medium mb-4'>{successMessage}</p>
				)}
				<div className='sm:col-span-2 flex justify-between'>
					<button
						type='submit'
						onClick={handleSubmit}
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

export default Profile;
