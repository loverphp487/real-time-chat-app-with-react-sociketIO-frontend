import { type RootState } from '@/store';
import type { CookieValues } from '@/types';
import API from '@/utilis/axios-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LogOut, Upload, Volume2Icon, VolumeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

/**
 * ProfileHeader component that displays the user's profile picture and name.
 * It also displays buttons to log out the user and to toggle the volume.
 *
 * @returns {JSX.Element} - The ProfileHeader component
 */
const ProfileHeader = () => {
	const [turnoff, setTurnoff] = useState(true);
	//@ts-ignore
	const [cookies, setCookie, removeCookie] = useCookies<'token', CookieValues>([
		'token',
	]);
	const queryClient = useQueryClient();

	const user = useSelector((state: RootState) => state.auth.userInfo);

	const { mutateAsync } = useMutation({
		mutationKey: ['logout'],
		/**
		 * Logs out the user from the current session.
		 *
		 * Sends a POST request to the logout endpoint with the current workspace ID.
		 *
		 * @returns {Promise<AxiosResponse>} - The response from the server
		 */

		mutationFn: async () => await API.post('user/logout'),
	});

	/**
	 * Logs out the user from the current session.
	 * Sends a POST request to the logout endpoint with the current workspace ID.
	 * Displays a success toast message with the message from the response.
	 * Dispatches the Logout action to clear the user information from the state.
	 * Navigates to the login page.
	 * Displays an error toast message if there is an error during the request.
	 */
	const HandelLogout = async (event: MouseEvent | any) => {
		try {
			event.preventDefault();
			await mutateAsync()
				.then((res: any) => {
					removeCookie('token');
					toast.success(res?.data?.message, {
						onClose() {
							queryClient.removeQueries();
							queryClient.clear();
							window.sessionStorage.clear();
							window.localStorage.clear();
							window.location.reload();
						},
					});
				})
				.catch((err: any) => {
					toast.error(err?.response?.data?.message || err?.message);
				});
		} catch (error) {}
	};

	useEffect(() => {
		document.title = 'chat page | Realtime Chat App '; // Set the desired title for this page
	}, []); // The empty dependency array ensures this runs only once on mount

	return (
		<div className="p border-b border-slate-600/30 px-6 py-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="avatar avatar-online  group cursor-pointer">
						<div className="w-12 rounded-full relative">
							<img
								src={user?.profilePic}
								alt="profile picture"
								className="size-full object-cover"
							/>
							<div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<Upload className="size-4 text-slate-100" />
							</div>
						</div>
					</div>
					<div>
						<h1 className="text-slate-400 max-w-30 truncate">
							{user?.firstName}
						</h1>
						<p className="text-slate-400 text-xs">online</p>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<button
						onClick={HandelLogout}
						className="text-slate-400 hover:text-slate-100 cursor-pointer transition-colors duration-300"
					>
						<LogOut className="size-5 " />
					</button>
					<button
						onClick={() => setTurnoff(!turnoff)}
						className="text-slate-400 hover:text-slate-100 cursor-pointer transition-colors duration-300"
					>
						{turnoff ? (
							<Volume2Icon className="size-5 " />
						) : (
							<VolumeOff className="size-5 " />
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProfileHeader;
