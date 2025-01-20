const FileDelete = () => {
  const extractKeyFromUrl = (url) => {
		const parts = url.split('/');
		return parts.slice(parts.indexOf('uploads')).join('/'); // Adjust as per your folder structure
  };
  
  const handleDelete = async (fileKey) => {
		try {
			const response = await fetch('/api/uploads/delete', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ key: fileKey }),
			});

			if (response.ok) {
				alert('File deleted successfully');
				// Update the UI or remove the file from the list
			} else {
				const { error } = await response.json();
				alert(`Failed to delete file: ${error}`);
			}
		} catch (error) {
			console.error('Error deleting file:', error);
			alert('An error occurred while deleting the file.');
		}
  };

  return (
		<div>
			<ul>
				{files.map((file) => (
					<li key={file.key}>
						<a href={file.url} target='_blank' rel='noopener noreferrer'>
							{file.name}
						</a>
						<button onClick={() => handleDelete(file.key)}>Delete</button>
					</li>
				))}
			</ul>
		</div>
  );
}