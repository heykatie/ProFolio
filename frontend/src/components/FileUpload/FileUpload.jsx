// import axios from 'axios';
import { useState } from 'react';
import {useSelector} from 'react-redux';
import './FileUpload.css';

const FileUpload = () => {
	const [file, setFile] = useState(null);
	const [uploadedUrl, setUploadedUrl] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const sessionUser = useSelector((state) => state.session.user);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const uploadFile = async () => {
		if (!file) {
			alert('Please select a file first');
			return;
		}

		const userId = sessionUser.id;

		setIsLoading(true);
		try {
			// Step 1: Fetch presigned URL
			console.log('Uploading file:', file.name); // Debugging log
			const response = await fetch(
				`/api/uploads/upload-url?key=uploads/${file.name}&contentType=${file.type}&userId=${userId}`
			);

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Error from backend:', errorData);
				alert(errorData.error || 'Failed to get presigned URL');
				setIsLoading(false);
				return;
			}

			const { url } = await response.json();
			if (!url) {
				console.error('Failed to get presigned URL');
				setIsLoading(false);
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

				// Step 3: Notify the backend to save the S3 URL to the database
				const saveResponse = await fetch('/api/uploads/upload', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userId: sessionUser.id, 
						fileUrl: url,
					}),
				});

				if (!saveResponse.ok) {
					console.error(
						'Error saving file URL:',
						await saveResponse.text()
					);
				} else {
					const saveResult = await saveResponse.json();
					setUploadedUrl(saveResult.url); // Display the uploaded URL
				}

			} else {
				console.error('Error uploading file', await uploadResponse.text());
			}
		} catch (err) {
			console.error('Error during upload:', err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<input type='file' onChange={handleFileChange} />
			<button onClick={uploadFile} disabled={isLoading}>
				{isLoading ? 'Uploading...' : 'Upload'}
			</button>

			{isLoading && <div className="spinner"></div> && <p>Uploading your file, please wait...</p>}


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


	// const handleUpload = async () => {
	// 	if (!file) {
	// 		alert('Please select a file first');
	// 		return;
	// 	}

	// 	const formData = new FormData();
	// 	formData.append('file', file);

	// 	try {
	// 		const response = await axios.post('/api/uploads/upload', formData, {
	// 			headers: {
	// 				'Content-Type': 'multipart/form-data',
	// 			},
	// 		});
	// 		setUploadedUrl(response.data.url);
	// 	} catch (err) {
	// 		console.error(err);
	// 		alert('Failed to upload file');
	// 	}
	// };