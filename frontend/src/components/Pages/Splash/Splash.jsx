import React from 'react';

const Splash = () => {
	return (
		<div className='splash-page bg-background text-text-primary dark:bg-background-dark dark:text-text-primary-dark'>
			{/* Headline Section */}
			<section className='headline-section flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-surface dark:bg-surface-dark'>
				<div className='headline-text max-w-xl'>
					<h1 className='text-4xl font-heading font-bold mb-4'>
						Imagine Your Future. Build Your ProFolio.
					</h1>
					<p className='text-lg leading-relaxed mb-6'>
						Showcase your experience, projects, achievements, and
						testimonials in minutes.
					</p>
					<button className='get-started-btn btn-primary px-6 py-3'>
						Get Started
					</button>
				</div>
				<div className='headline-image mt-8 md:mt-0 md:ml-16'>
					<img
						src='/path/to/placeholder-image.gif'
						alt='Example GIF'
						className='rounded-lg shadow-lg'
					/>
				</div>
			</section>

			{/* Features Section */}
			<section className='features-section py-16 bg-surface dark:bg-surface-dark'>
				<div className='features-container grid grid-cols-1 md:grid-cols-3 gap-8 px-8'>
					<div className='feature-item text-center'>
						<i className='feature-icon text-4xl text-primary'>GitHub</i>
						<p className='mt-4 font-body text-lg'>GitHub Integration</p>
					</div>
					<div className='feature-item text-center'>
						<i className='feature-icon text-4xl text-primary'>LinkedIn</i>
						<p className='mt-4 font-body text-lg'>
							LinkedIn Recommendations
						</p>
					</div>
					<div className='feature-item text-center'>
						<i className='feature-icon text-4xl text-primary'>Custom</i>
						<p className='mt-4 font-body text-lg'>Custom Sections</p>
					</div>
				</div>
				<div className='trusted-by text-center mt-16'>
					<p className='text-lg font-body mb-4'>
						Recruited & trusted by the world's leading tech companies.
					</p>
					<div className='logos flex justify-center space-x-8'>
						<img
							src='/path/to/company1-logo.png'
							alt='Company 1'
							className='h-10'
						/>
						<img
							src='/path/to/company2-logo.png'
							alt='Company 2'
							className='h-10'
						/>
						<img
							src='/path/to/company3-logo.png'
							alt='Company 3'
							className='h-10'
						/>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className='splash-footer bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark py-8 px-8'>
				<div className='flex justify-between items-center'>
					<p className='text-sm'>© 2025 ProFolio. All Rights Reserved.</p>
					<nav className='flex space-x-4'>
						<a href='#portfolio' className='hover:text-primary-hover'>
							Portfolio
						</a>
						<a href='#linkedin' className='hover:text-primary-hover'>
							LinkedIn
						</a>
						<a href='#github' className='hover:text-primary-hover'>
							GitHub
						</a>
						<a href='#leetcode' className='hover:text-primary-hover'>
							LeetCode
						</a>
						<a href='#contact' className='hover:text-primary-hover'>
							Contact
						</a>
					</nav>
					<div className='social-icons flex space-x-4'>
						<i className='social-icon'>FB</i>
						<i className='social-icon'>Twitter</i>
						<i className='social-icon'>Instagram</i>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Splash;
