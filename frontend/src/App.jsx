import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import LoginModal from './components/LoginModal';

const Layout = () => {
	return (
		<main>
			<NavBar />
			<Outlet />
		</main>
	);
};

const routes = [
	{
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <h1> test </h1>,
			},
			{
        path: '/login',
        element: <LoginModal />,
			},
		],
	},
];

const router = createBrowserRouter(routes);

export default function App() {
	return <RouterProvider router={router} />;
}
