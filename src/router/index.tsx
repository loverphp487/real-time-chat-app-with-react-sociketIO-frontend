import { lazy } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/router/protected.route';
import AuthRoute from '@/router/auth.route';

const App = lazy(() => import('@/App'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));

const router: RouteObject[] | any = createBrowserRouter([
	{
		path: '/',
		Component: App,
		children: [
			{
				index: true,
				element: (
					<ProtectedRoute>
						<ChatPage />
					</ProtectedRoute>
				),
			},
			{
				path: '/login',
				element: (
					<AuthRoute>
						<LoginPage />
					</AuthRoute>
				),
			},
			{
				path: '/sign-up',
				element: (
					<AuthRoute>
						<SignupPage />
					</AuthRoute>
				),
			},
		],
	},
]);

export default router;
