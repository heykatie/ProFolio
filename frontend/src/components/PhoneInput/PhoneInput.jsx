import React, { useState } from 'react';
import { AsYouType } from 'libphonenumber-js';

const PhoneInput = ({ value, onChange }) => {
	const [formattedPhone, setFormattedPhone] = useState(value || '');
	const [error, setError] = useState('');

	const handleChange = (e) => {
		const rawInput = e.target.value;

		// Validate that the input is only numbers
		const isValid = /^[0-9]*$/.test(rawInput.replace(/[-() ]/g, ''));
		if (!isValid) {
			setError('Only numbers are allowed.');
			return;
		}

		setError('');
		const formatter = new AsYouType('US'); // Format as US phone number
		const formatted = formatter.input(rawInput); // Formats the input dynamically
		setFormattedPhone(formatted);
		onChange(formatted); // Pass formatted value to the parent
	};

	return (
		<div>
			<input
				type='text'
				value={formattedPhone}
				onChange={handleChange}
				placeholder='Phone Number (Optional)'
				onFocus={(e) => (e.target.placeholder = '1 (234) 567-8901')}
				onBlur={(e) => (e.target.placeholder = 'Phone Number (Optional)')}
				className='form-input'
			/>
			<div className='h-1'>
				{error && <p className='error-message'>{error}</p>}
			</div>
		</div>
	);
};

export default PhoneInput;
