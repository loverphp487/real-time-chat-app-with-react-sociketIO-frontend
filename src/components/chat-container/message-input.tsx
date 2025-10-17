import { SetChatContainer } from '@/slices/chatSlice';
import type { RootState } from '@/store';
import API from '@/utilis/axios-api';
import useKeyboardSound from '@/utilis/useKeyboardSound';
// import useKeyboardSound from '@/utilis/useKeyboardSound';
import { useMutation } from '@tanstack/react-query';
import { ImageIcon, SendIcon } from 'lucide-react';
import {
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type KeyboardEvent,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

/**
 * A component that displays a message input field.
 * It allows users to input and send messages.
 * The component uses the useMutation hook from react-query to handle the submission of new messages.
 * It also uses the useSelector hook from react-redux to retrieve the selectedUser atom from the chat settings state.
 * The component displays an error toast message if there is an error during the submission of the message.
 * @returns {JSX.Element} A JSX element representing the message input field.
 */
const MessageInput = () => {
	const [message, setMessage] = useState<string>('');
	const { playKeyboardSound } = useKeyboardSound();
	const messageInput = useRef<HTMLInputElement>(null);

	const dispatch = useDispatch();

	const { SelectUserChat, ChatContainer, keyboardSound } = useSelector(
		(state: RootState) => state.chats,
	);
	const { userInfo } = useSelector((state: RootState) => state.auth);

	const { isPending, mutateAsync } = useMutation({
		mutationKey: ['add-message'],
		/**
		 * Submits a new message to the server.
		 * It takes a message as a string and sends a POST request to the '/chats/new-message' endpoint with the message and the receiverId.
		 * The receiverId is retrieved from the selectedUser atom in the chat settings state.
		 * @param {string} message - The message to be sent.
		 * @returns {Promise<AxiosResponse>} A promise that resolves with the response object.
		 */
		mutationFn: (message: string) =>
			API.post('/chats/new-message', {
				message,
				receiverId: SelectUserChat?._id,
			}),
	});

	/**
	 * Submits a new message to the server.
	 * It takes the current message value from the state and resets the state to an empty string.
	 * It sends a POST request to the '/chats/new-message' endpoint with the current message value and the receiver ID from the state.
	 * If the request is successful, it logs the response data to the console.
	 * If there is an error during the request, it displays an error toast message with the error message.
	 * If there is an error during the execution of the function, it logs the error to the console.
	 */
	const onsubmit = async () => {
		try {
			let msg: string | null = message;
			setMessage('');

			await mutateAsync(msg)
				.then(() => {
					msg = null;
				})
				.catch((err) => {
					toast.error(err.message);
				});
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handles the keydown event for the message input field.
	 * If the pressed key is Enter, it sends a new message to the server with the current message value.
	 * It resets the message value to an empty string after sending the message.
	 * If there is an error during the request, it displays an error toast message with the error message.
	 */
	const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
		try {
			if (event.key === 'Enter') {
				let msg: string | null = message;
				setMessage('');

				// socket.emit('newMessage', msg);

				const id = uuidv4();

				dispatch(
					SetChatContainer([
						...ChatContainer,
						{
							_id: id,
							senderId: userInfo?._id as string,
							receiverId: SelectUserChat?._id as string,
							message: msg,
							createdAt: new Date(Date.now()),
						},
					]),
				);
				await mutateAsync(msg)
					.then(() => {
						msg = null;
					})
					.catch((err) => {
						toast.error(err.message);
						dispatch(
							SetChatContainer([
								...ChatContainer.filter((item) => item._id !== id),
							]),
						);
					});
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (messageInput.current && !isPending) {
			messageInput.current.focus(); // Refocus the input
		}
	}, [message, messageInput.current, isPending]);

	return (
		<div
			className="message-input w-full  p-4 border-t border-slate-700/50"
			data-theme="abyss"
		>
			<div className="flex items-center max-w-3xl mx-auto space-x-4">
				<input
					type="text"
					className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
					placeholder="Type your message..."
					value={message}
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setMessage(e.currentTarget.value);
						if (keyboardSound) playKeyboardSound();
					}}
					onKeyDown={handleKeyDown}
					disabled={isPending}
					ref={messageInput}
				/>
				<button className="cursor-pointer">
					<ImageIcon className="w-5 h-5" />
				</button>
				<button
					type="button"
					className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
					disabled={message.trim().length < 1 || isPending}
					onClick={onsubmit}
				>
					<SendIcon className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
};

export default MessageInput;
