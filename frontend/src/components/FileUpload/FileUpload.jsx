import { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
	const [file, setFile] = useState(null);
	const [uploadedUrl, setUploadedUrl] = useState('');

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleUpload = async () => {
		if (!file) {
			alert('Please select a file first');
			return;
		}

		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await axios.post('/api/uploads/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			setUploadedUrl(response.data.url);
		} catch (err) {
			console.error(err);
			alert('Failed to upload file');
		}
	};

	const uploadFile = async () => {
		if (!file) {
			alert('Please select a file first');
			return;
		}

		try {
			// Step 1: Fetch presigned URL
			console.log('Uploading file:', file.name); // Debugging log
			const response = await fetch(
				`/api/uploads/upload-url?key=uploads/${file.name}&contentType=${file.type}`
			);

			const { url } = await response.json();
			if (!url) {
				console.error('Failed to get presigned URL');
				return;
			}

			// Step 2: Upload file to S3
			const uploadResponse = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': file.type,
				},
				body: file,
			});

			if (uploadResponse.ok) {
				console.log('File uploaded successfully');
			} else {
				console.error('Error uploading file', await uploadResponse.text());
			}
		} catch (err) {
			console.error('Error during upload:', err);
		}
	};

	return (
		<div>
			<input type='file' onChange={handleFileChange} />
			<button onClick={uploadFile}>Upload</button>
			{uploadedUrl && (
				<div>
					<p>File uploaded successfully:</p>
					<a href={uploadedUrl} target='_blank' rel='noopener noreferrer'>
						{uploadedUrl}
					</a>
				</div>
			)}
		</div>
	);
};

export default FileUpload;
