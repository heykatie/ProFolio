import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uploadFiles } from '../../store/file';
import './FileUpload.css';

const FileUpload = () => {
	const dispatch = useDispatch();
	const isLoading = useSelector((state) => state.file.isLoading);
	const uploadedUrls = useSelector((state) => state.file.uploadedUrls);
	const sessionUser = useSelector((state) => state.session.user);

	const [profilePicture, setProfilePicture] = useState(null);
	const [files, setFiles] = useState([]);
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

	const handleFilesChange = (e) => {
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

		setFiles((prev) => [...prev, ...validFiles]);
	};

	const handleUpload = () => {
		dispatch(
			uploadFiles(
				profilePicture,
				files,
				sessionUser.id,
				import.meta.env.VITE_S3_BUCKET,
				import.meta.env.VITE_AWS_REGION
			)
		);
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
				onChange={handleFilesChange}
			/>
			<button onClick={handleUpload} disabled={isLoading}>
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
