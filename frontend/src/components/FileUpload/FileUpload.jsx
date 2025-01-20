import { useState } from 'react';
import { useSelector } from 'react-redux';
import './FileUpload.css';

const FileUpload = () => {
	const [file, setFile] = useState(null);
	const [uploadedUrl, setUploadedUrl] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const sessionUser = useSelector((state) => state.session.user);

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

		if (!selectedFile) return;

		if (selectedFile.size > MAX_FILE_SIZE) {
			alert(
				'File size exceeds the 5MB limit. Please choose a smaller file.'
			);
			setFile(null);
			return;
		}

		setFile(selectedFile);
	};

	const uploadFile = async () => {
		if (!file) {
			alert('Please select a file first');
			return;
		}
		setIsLoading(true);

		try {
			const userId = sessionUser.id;
			// Step 1: Fetch presigned URL
			const response = await fetch(
				`/api/uploads/upload-url?key=${file.name}&contentType=${file.type}&fileSize=${file.size}`
			);

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Error fetching presigned URL:', errorData);
				alert(errorData.error || 'Failed to get presigned URL');
				setIsLoading(false);
				return;
			}

			const { url, uniqueKey } = await response.json();

			// Step 2: Upload file to S3
			const uploadResponse = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': file.type,
				},
				body: file,
			});

			if (!uploadResponse.ok) {
				console.error('Error uploading file:', await uploadResponse.text());
				alert('Failed to upload file');
				setIsLoading(false);
				return;
			}

			// Step 3: Save S3 file key to backend
			const saveResponse = await fetch('/api/uploads/upload', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId,
					fileUrl: uniqueKey, // Pass only the uniqueKey
				}),
			});

			if (!saveResponse.ok) {
				console.error('Error saving file key:', await saveResponse.text());
				alert('Failed to save file key');
				setIsLoading(false);
				return;
			}

			const saveResult = await saveResponse.json();

			// Construct the final viewable URL
			setUploadedUrl(
				`https://${import.meta.env.VITE_S3_BUCKET}.s3.${
					import.meta.env.VITE_AWS_REGION
				}.amazonaws.com/${saveResult.key}`
			);
		} catch (err) {
			console.error('Error during file upload process:', err);
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

			{isLoading && <div className='spinner'></div> && (
				<p>Uploading your file, please wait...</p>
			)}

			{uploadedUrl && (
				<div>
					<p>File uploaded successfully:</p>
					<a
						href={uploadedUrl}
						target='_blank'
						rel='noopener noreferrer'>
						View File
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
