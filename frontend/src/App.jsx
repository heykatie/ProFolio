import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restoreUser } from './store/session';
import NavBar from './components/NavBar';
import LoginModal from './components/LoginModal';

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
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <h1> herro </h1>,
			},
			{
        path: '/login',
        element: <LoginModal />,
			},
		],
	},
];

const router = createBrowserRouter(routes);

const App = () => {
	return <RouterProvider router={router} />;
}

export default App;