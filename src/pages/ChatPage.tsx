import {
	ActiveTabSwitch,
	AnimatedBorder,
	ChatContainer,
	ChatsList,
	ContactList,
	NoConversationPlaceholder,
	ProfileHeader,
} from '@/components';
import type { RootState } from '@/store';
import { useWindowWidth } from '@react-hook/window-size';
import { useQueryClient } from '@tanstack/react-query';
import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, type Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import useNotificationSound from '@/utilis/useNotificationSound';
import type { UserType } from '@/types';
import { SetSelectUserChat } from '@/slices/chatSlice';

/**
 * ChatPage is a component that displays a chat interface.
 * It consists of two parts: a left side with a profile header,
 * an active tab switch, and either a chats list or a contact list,
 * and a right side with a chat container.
 * The component uses the selectedUserInitialValue atom from jota,
 * which is used to determine which tab to display.
 */
const ChatPage = () => {
	const { SelectTab, SelectUserChat, notificationSound } = useSelector(
		(state: RootState) => state.chats,
	);
	const dispatch = useDispatch();
	const queryClinet = useQueryClient();

	const onlyWidth = useWindowWidth();

	const CustomToastContent = (user: UserType) => (
		<div className="flex items-center justify-between w-full p-2 text-sm gap-4">
			<h4>
				new Message! from <br /> {user.firstName}
			</h4>
			<button
				onClick={() => {
					dispatch(SetSelectUserChat(user));
				}}
				className="btn btn-sm bg-indigo-400 rounded-full text-white"
			>
				Open
			</button>
		</div>
	);

	useEffect(() => {
		const token = Cookies.get('token');
		const socket: Socket = io(import.meta.env.VITE_BASE_URL, {
			withCredentials: true,
			autoConnect: true,
			auth: {
				token: token,
			},
		});

		socket.on('newMessage', (data: { user: UserType }) => {
			if (SelectUserChat?._id !== data?.user._id) {
				if (notificationSound) {
					toast.info(<CustomToastContent {...data?.user} />);
					useNotificationSound();
				}
			}
			queryClinet.invalidateQueries({
				queryKey: ['conversations', SelectUserChat?._id],
			});
		});
	}, [SelectUserChat, notificationSound]);

	return (
		<AnimatedBorder>
			<div className="w-full flex h-[calc(100vh-5.75rem)]">
				{onlyWidth > 768 ? (
					<>
						{/* Left Side */}
						<div
							className="h-full flex flex-col   w-80 overflow-hidden border-r border-slate-600/30"
							data-theme="dark"
						>
							<ProfileHeader />
							<ActiveTabSwitch />
							{SelectTab === 'chats' ? <ChatsList /> : <ContactList />}
						</div>
						{/* Right Side */}
						<div className="flex-1 bg-slate-900/50 backdrop-blur-sm w-full  flex flex-col">
							{SelectUserChat ? (
								<ChatContainer />
							) : (
								<NoConversationPlaceholder />
							)}
						</div>
					</>
				) : (
					<>
						{SelectUserChat ? (
							<ChatContainer />
						) : (
							<div
								className="h-full flex flex-col w-full  overflow-hidden border-r border-slate-600/30"
								data-theme="dark"
							>
								<ProfileHeader />
								<ActiveTabSwitch />
								{SelectTab === 'chats' ? <ChatsList /> : <ContactList />}
							</div>
						)}
					</>
				)}
			</div>
		</AnimatedBorder>
	);
};

export default memo(ChatPage);
