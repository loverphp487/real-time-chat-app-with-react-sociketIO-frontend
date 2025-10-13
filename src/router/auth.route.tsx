import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

/**
 * A protected route component that renders its children only if the user is not authenticated.
 * If the user is authenticated, it redirects the user to the home page.
 */
const AuthRoute = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const token = Cookies.get('token');

	return token ? <Navigate to="/" replace /> : children;
};

export default AuthRoute;
