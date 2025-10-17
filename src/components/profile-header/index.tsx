import { setCredintials } from '@/slices/authSlice';
import { setKeyboadSound, setNotificationSound } from '@/slices/chatSlice';
import { type RootState } from '@/store';
import type { CookieValues } from '@/types';
import API from '@/utilis/axios-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Bell,
	BellOff,
	LogOut,
	Upload,
	Volume2Icon,
	VolumeOff,
} from 'lucide-react';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

/**
 * ProfileHeader component that displays the user's profile picture and name.
 * It also displays buttons to log out the user and to toggle the volume.
 *
 * @returns {JSX.Element} - The ProfileHeader component
 */
const ProfileHeader = () => {
	const dispatch = useDispatch();
	//@ts-ignore
	const [cookies, setCookie, removeCookie] = useCookies<'token', CookieValues>([
		'token',
	]);

	const queryClient = useQueryClient();

	const user = useSelector((state: RootState) => state.auth.userInfo);

	const { mutateAsync: mutateAsyncUpdateProfile, isPending } = useMutation({
		mutationKey: ['update-profile-picture'],
		/**
		 * Updates a user's profile picture.
		 * @param {FormData} form - The form data containing the profile picture.
		 * @returns {Promise<AxiosResponse>} A promise that resolves with the response object.
		 */
		mutationFn: async (form: FormData) =>
			await API.post('/user/update-profile', form),
	});

	const [imageUpload, setImageUpload] = useState<string | null>(null);

	const imageInput = useRef<HTMLInputElement | null>(null);

	/**
	 * Handles file change event on image input field.
	 * If a file is selected, reads the file using FileReader and sets the imageUpload state to the file content.
	 * If an error occurs while reading the file, logs the error to the console.
	 * @param {{ target: ChangeEvent<HTMLInputElement>['target'] }} event - The event object containing the target element.
	 */
	const handleFileChange = async ({
		target,
	}: ChangeEvent<HTMLInputElement>) => {
		if (target.files && target.files.length > 0) {
			const file = target.files[0] as File;

			const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

			if (!allowedTypes.includes(file.type)) {
				toast.error(`image type not allowed`);
				return;
			}

			const reader = new FileReader();

			/**
			 * Handles the file read operation's onload event.
			 * When the file read operation is complete, sets the imageUpload state to the file content.
			 * Then, creates a FormData object and appends the file content to it.
			 * Finally, calls the mutateAsyncUpdateProfile function to update the user's profile picture.
			 * @param {{ target: ProgressEvent<FileReader>['target'] }} event - The event object containing the target element.
			 */
			reader.onload = async (e: ProgressEvent<FileReader>) => {
				// The result of the file read operation is available in e.target.result
				const fileContent = e.target?.result as string; // Cast to appropriate type (e.g., string, ArrayBuffer)
				setImageUpload(fileContent);
				const form = new FormData();

				form.append('profilePic', fileContent);

				try {
					await mutateAsyncUpdateProfile(form)
						.then(({ data }) => {
							toast.success('profile update successfully');
							dispatch(setCredintials(data.user));
						})
						.catch((err: any) => {
							toast.error(err.message);
						});
				} catch (error) {}
			};

			/**
			 * Handles an error event when reading a file using the FileReader.
			 * Logs an error message to the console when an error occurs.
			 * @param {{ target: ProgressEvent<FileReader>['target'] }} e - The event object containing the target element.
			 */
			reader.onerror = (e: ProgressEvent<FileReader>) => {
				console.error('Error reading file:', e.target?.error);
			};

			// Choose a reading method based on your needs
			// reader.readAsText(file, 'UTF-8'); // Read as text
			reader.readAsDataURL(file); // Read as Data URL (e.g., for image previews)
			// reader.readAsArrayBuffer(file); // Read as ArrayBuffer
		}
	};

	const { keyboardSound, notificationSound } = useSelector(
		(state: RootState) => state.chats,
	);

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
					<div
						className="avatar avatar-online  group cursor-pointer"
						onClick={() => {
							if (!isPending) {
								imageInput.current?.click();
							}
						}}
					>
						<div className="w-12 rounded-full relative">
							<img
								src={imageUpload ? imageUpload : user?.profilePic}
								alt="profile picture"
								className="size-full object-cover"
							/>
							<div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<Upload className="size-4 text-slate-100" />
							</div>
							<input
								type="file"
								className="hidden -z-20"
								accept="image/png, image/jpeg, image/jpg"
								ref={imageInput}
								onChange={handleFileChange}
							/>
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
						<LogOut className="size-4 " />
					</button>
					<button
						onClick={() => dispatch(setKeyboadSound(!keyboardSound))}
						className="text-slate-400 hover:text-slate-100 cursor-pointer transition-colors duration-300"
					>
						{keyboardSound ? (
							<Volume2Icon className="size-4 " />
						) : (
							<VolumeOff className="size-4 " />
						)}
					</button>
					<button
						onClick={() => dispatch(setNotificationSound(!notificationSound))}
						className="text-slate-400 hover:text-slate-100 cursor-pointer transition-colors duration-300"
					>
						{notificationSound ? (
							<Bell className="size-4 " />
						) : (
							<BellOff className="size-4 " />
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProfileHeader;
