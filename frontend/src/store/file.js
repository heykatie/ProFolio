import { csrfFetch } from './csrf';

// Action Types
const SET_UPLOADED_URLS = 'files/SET_UPLOADED_URLS';
const SET_IS_LOADING = 'files/SET_IS_LOADING';

// Action Creators
export const setUploadedUrls = (urls) => ({
	type: SET_UPLOADED_URLS,
	urls,
});

export const setIsLoading = (isLoading) => ({
	type: SET_IS_LOADING,
	isLoading,
});

// Thunks
export const uploadFileToS3 =
	(file, folder, userId, bucket, region) => async (dispatch) => {
		try {
			// Fetch presigned URL
			const response = await csrfFetch(
				`/api/uploads/upload-url?key=${folder}/${file.name}&contentType=${file.type}&fileSize=${file.size}`
			);
			const { url, uniqueKey } = await response.json();

			// Upload file to S3
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

			// Save file info in the backend
			await csrfFetch('/api/uploads/upload', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId,
					fileUrl: `https://${bucket}.s3.${region}.amazonaws.com/${uniqueKey}`,
					type: folder, // Specify file type
				}),
			});

			return {
				url: `https://${bucket}.s3.${region}.amazonaws.com/${uniqueKey}`,
			};
		} catch (error) {
			console.error('Error uploading file:', error);
			throw error;
		}
	};

export const uploadFiles =
	(profilePicture, Files, userId, bucket, region) => async (dispatch) => {
		if (!profilePicture && Files.length === 0) {
			alert('Please select files to upload.');
			return;
		}

		dispatch(setIsLoading(true));
		const uploadedUrls = [];

		try {
			// Upload profile picture
			if (profilePicture) {
				const profileResponse = await dispatch(
					uploadFileToS3(
						profilePicture,
						'profile_picture',
						userId,
						bucket,
						region
					)
				);
				console.log('Profile Picture URL:', profileResponse.url);
				uploadedUrls.push(profileResponse.url);
			}

			// Upload  files
			if (Files.length > 0) {
				const FilesResponses = await Promise.all(
					Files.map((file) =>
						dispatch(
							uploadFileToS3(file, '_files', userId, bucket, region)
						)
					)
				);
				console.log(' Files URLs:', FilesResponses);
				uploadedUrls.push(...FilesResponses.map((res) => res.url));
			}

			dispatch(setUploadedUrls(uploadedUrls));
		} catch (err) {
			console.error('Error uploading files:', err);
			alert('Failed to upload files.');
		} finally {
			dispatch(setIsLoading(false));
		}
	};

// Initial State
const initialState = {
	uploadedUrls: [],
	isLoading: false,
};

// Reducer
const fileReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_UPLOADED_URLS:
			return {
				...state,
				uploadedUrls: action.urls,
			};
		case SET_IS_LOADING:
			return {
				...state,
				isLoading: action.isLoading,
			};
		default:
			return state;
	}
};

export default fileReducer;
