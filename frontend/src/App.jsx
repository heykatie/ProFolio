import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restoreUser } from './store/session';
import NavBar from './components/NavBar';
import LoginModal from './components/Modals/LoginModal';
import SignupModal from './components/Modals/SignupModal';
import { ModalProvider } from './context/ModalContext';
import ProfilePage from './components/ProfilePage';

const Layout = () => {
	const dispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
		dispatch(restoreUser()).then(() => {
			setIsLoaded(true);
		});
  }, [dispatch]);

	return (
		<main>
			<NavBar />
			{isLoaded && <Outlet />}
		</main>
	);
};

const routes = [
	{
		element: (
			<ModalProvider>
				{' '}
				<Layout />{' '}
			</ModalProvider>
		),
		children: [
			{
				path: '/',
				element: <h1> you got this go </h1>,
			},
			{
				path: '/login',
				element: <LoginModal />,
			},
			{
				path: '/signup',
				element: <SignupModal />,
			},
			{
				path: '/profile',
				element: <ProfilePage />,
			},
			{
				path: 'test',
				element: <h3> you so awesome </h3>,
			},
			{
				path: '*',
				element: <h1>Page Not Found</h1>,
			},
		],
	},
];

const router = createBrowserRouter(routes);

const App = () => {
	return <RouterProvider router={router} />;
}

export default App;