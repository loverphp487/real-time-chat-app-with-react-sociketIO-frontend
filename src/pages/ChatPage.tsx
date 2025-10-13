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
import socket from '@/utilis/constant';
import { useQueryClient } from '@tanstack/react-query';

import { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * ChatPage is a component that displays a chat interface.
 * It consists of two parts: a left side with a profile header,
 * an active tab switch, and either a chats list or a contact list,
 * and a right side with a chat container.
 * The component uses the selectedUserInitialValue atom from jota,
 * which is used to determine which tab to display.
 */
const ChatPage = () => {
	const { SelectTab, SelectUserChat } = useSelector(
		(state: RootState) => state.chats,
	);
	const queryClinet = useQueryClient();

	useEffect(() => {
		socket.on('newMessage', (data) => {
			queryClinet.refetchQueries({
				queryKey: ['conversations', data?.senderId],
			});
		});
	}, []);

	return (
		<AnimatedBorder>
			<div className="w-full flex h-[calc(100vh-5.75rem)]">
				{/* Left Side */}
				<div
					className="h-full hidden md:flex md:flex-col w-full  md:w-80 overflow-hidden border-r border-slate-600/30"
					data-theme="dark"
				>
					<ProfileHeader />
					<ActiveTabSwitch />
					{SelectTab === 'chats' ? <ChatsList /> : <ContactList />}
				</div>
				{/* Right Side */}
				<div className="flex-1 bg-slate-900/50 backdrop-blur-sm w-full  flex flex-col">
					{SelectUserChat ? <ChatContainer /> : <NoConversationPlaceholder />}
				</div>
			</div>
		</AnimatedBorder>
	);
};

export default memo(ChatPage);
