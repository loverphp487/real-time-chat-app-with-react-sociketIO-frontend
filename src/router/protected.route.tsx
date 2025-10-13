import { setCredintials } from '@/slices/authSlice';
import type { UserType } from '@/types';
import API from '@/utilis/axios-api';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

/**
 * A protected route component that renders its children only if the user is authenticated.
 * If the user is not authenticated, it redirects the user to the login page.
 */
const ProtectedRoute = ({
	children,
}: Readonly<{ children: React.ReactNode }>) => {
	const token = Cookies.get('token');

	return !token ? (
		<Navigate to="/login" replace />
	) : (
		<MainLayoutRoute>{children}</MainLayoutRoute>
	);
};

/**
 * A protected route component that renders its children only if the user is authenticated.
 * If the user is not authenticated, it redirects the user to the login page.
 *
 * @param {React.ReactNode} children The children components to render
 * @returns The user data
 */
const MainLayoutRoute = ({
	children,
}: Readonly<{ children: React.ReactNode }>) => {
	const dispatch = useDispatch();

	const { data: authData, isLoading } = useQuery({
		queryKey: ['authUser'],
		/**
		 * Fetches the user data from the server and stores it in the
		 * `authUser` state variable. If the user is not logged in, it
		 * redirects to the home page.
		 *
		 * @returns The user data
		 */
		queryFn: async () =>
			await API.get('user/current').then(
				({ data }: { data: { message: string; user: UserType } }) => {
					dispatch(setCredintials(data.user));
					return data;
				},
			),
		staleTime: 0,
		retry: 2,
	});

	const user = authData?.user;

	if (isLoading) return <HashLoader size={50} color="#f09000" />;

	return !user ? <Navigate to="/login" replace /> : children;
};

export default ProtectedRoute;
