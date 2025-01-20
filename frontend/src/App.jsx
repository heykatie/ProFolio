import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restoreUser } from './store/session';
import NavBar from './components/NavBar';
import LoginModal from './components/Modals/LoginModal';
import SignupModal from './components/Modals/SignupModal';
import { ModalProvider } from './context/ModalContext';
import {
	Profile,
	Dashboard,
	Portfolios,
	Preview,
	Projects,
	Favorites,
	Activity,
	Create,
	Settings,
	Splash
} from './components/Pages';

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
				element: <Splash />,
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
				element: <Profile />,
			},
			{
				path: '/dashboard',
				element: <Dashboard />,
			},
			{
				path: '/portfolios',
				element: <Portfolios />,
			},
			{
				path: '/preview',
				element: <Preview />,
			},
			{
				path: '/projects',
				element: <Projects />,
			},
			{
				path: '/favorites',
				element: <Favorites />,
			},
			{
				path: '/activity',
				element: <Activity />,
			},
			{
				path: '/create',
				element: <Create />,
			},
			{
				path: '/settings',
				element: <Settings />,
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