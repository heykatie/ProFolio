import { useState } from 'react';
import { useSelector } from 'react-redux';
import './FileUpload.css';

const FileUpload = () => {
	const [isLoading, setIsLoading] = useState(false);
	const sessionUser = useSelector((state) => state.session.user);

	const [profilePicture, setProfilePicture] = useState(null);
	const [otherFiles, setOtherFiles] = useState([]);
	const [uploadedUrls, setUploadedUrls] = useState([]); // To store uploaded URLs
	const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

	const handleProfilePictureChange = (e) => {
		const selectedFile = e.target.files[0];

		if (!selectedFile) return;

		if (selectedFile.size > MAX_FILE_SIZE) {
			alert(
				'Profile picture exceeds the 5MB limit. Please choose a smaller file.'
			);
			setProfilePicture(null);
			return;
		}

		setProfilePicture(selectedFile);
	};

	const handleOtherFilesChange = (e) => {
		const selectedFiles = Array.from(e.target.files);

		const validFiles = selectedFiles.filter(
			(file) => file.size <= MAX_FILE_SIZE
		);
		const invalidFiles = selectedFiles.length - validFiles.length;

		if (invalidFiles > 0) {
			alert(
				`${invalidFiles} files were too large and not added. Only files under 5MB are allowed.`
			);
		}

		setOtherFiles((prev) => [...prev, ...validFiles]); // Append new files to the existing array
	};

	const uploadFiles = async () => {
		if (!profilePicture && otherFiles.length === 0) {
			alert('Please select files to upload.');
			return;
		}

		setIsLoading(true);

		try {
			// Upload profile picture
			if (profilePicture) {
				const profileResponse = await uploadFileToS3(
					profilePicture,
					'profile_picture'
				);
				console.log('Profile Picture URL:', profileResponse.url);
			}

			// Upload other files
			if (otherFiles.length > 0) {
				const otherFilesResponses = await Promise.all(
					otherFiles.map((file) => uploadFileToS3(file, 'other_files'))
				);
				console.log('Other Files URLs:', otherFilesResponses);
				setUploadedUrls(otherFilesResponses.map((res) => res.url));
			}
		} catch (err) {
			console.error('Error uploading files:', err);
			alert('Failed to upload files.');
		} finally {
			setIsLoading(false);
		}
	};

	const uploadFileToS3 = async (file, folder, type) => {
		const response = await fetch(
			`/api/uploads/upload-url?key=${folder}/${file.name}&contentType=${file.type}&fileSize=${file.size}`
		);
		const { url, uniqueKey } = await response.json();

		const uploadResponse = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': file.type,
			},
			body: file,
		});

		if (!uploadResponse.ok) {
			throw new Error('Failed to upload file to S3.');
		}

		await fetch('/api/uploads/upload', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId: sessionUser.id,
				fileUrl: `https://${import.meta.env.VITE_S3_BUCKET}.s3.${
					import.meta.env.VITE_AWS_REGION
				}.amazonaws.com/${uniqueKey}`,
				type, // Specify file type
			}),
		});

		return {
			url: `https://${import.meta.env.VITE_S3_BUCKET}.s3.${
				import.meta.env.VITE_AWS_REGION
			}.amazonaws.com/${uniqueKey}`,
		};
	};

	return (
		<div>
			<h2>Profile Picture</h2>
			<input
				type='file'
				accept='image/*'
				onChange={handleProfilePictureChange}
			/>
			<h2>Resumes and Certificates</h2>
			<input
				type='file'
				accept='.pdf,.doc,.docx,.png,.jpg,.jpeg'
				multiple
				onChange={handleOtherFilesChange}
			/>
			<button onClick={uploadFiles} disabled={isLoading}>
				{isLoading ? 'Uploading...' : 'Upload Files'}
			</button>

			{isLoading && <p>Uploading files, please wait...</p>}

			{uploadedUrls.length > 0 && (
				<div>
					<h3>Uploaded Files:</h3>
					<ul>
						{uploadedUrls.map((url, idx) => (
							<li key={idx}>
								<a href={url} target='_blank' rel='noopener noreferrer'>
									View File
								</a>
							</li>
						))}
					</ul>
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
