import { SetChatContainer } from '@/slices/chatSlice';
import type { RootState } from '@/store';
import type { MessageType } from '@/types';
import API from '@/utilis/axios-api';
import { useQuery } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatHeader from './chat-header';

import MessageInput from './message-input';

// Replace with your server's URL
/**
 * ChatContainer is a component that displays a chat interface.
 * It consists of two parts: a header with the user's profile picture, name, and status,
 * and a body with a scrollable list of chat bubbles.
 * The component uses the selectedUserInitialValue atom from jota,
 * which is used to determine which tab to display.
 * The component also uses the MessageInput component to allow users to input and send messages.
 */

const ChatContainer = () => {
	const dispatch = useDispatch();
	const chatBody = useRef<HTMLDivElement>(null);

	const { SelectUserChat, ChatContainer } = useSelector(
		(state: RootState) => state.chats,
	);

	const userInfo = useSelector((state: RootState) => state.auth.userInfo);

	const { isLoading } = useQuery({
		queryKey: ['conversations', SelectUserChat?._id],
		/**
		 * Fetches the list of messages between the current user and the user specified by the SelectUserChat atom.
		 * It sets the messages state to the response data and returns the response data.
		 * If the response data does not contain the 'messages' property, the messages state is not updated.
		 */
		queryFn: async () =>
			API.get('/chats/all-conversations/' + SelectUserChat?._id).then(
				({ data }: AxiosResponse<{ messages: MessageType[] }>) => {
					dispatch(SetChatContainer(data?.messages));

					return data;
				},
			),
	});

	useEffect(() => {
		if (chatBody?.current && ChatContainer.length > 0 && !isLoading) {
			(chatBody?.current as HTMLDivElement).scrollIntoView({
				behavior: 'smooth',
			});
		}
	}, [ChatContainer, chatBody.current, isLoading]);

	return (
		<div className="w-full h-full flex flex-col">
			<ChatHeader />
			<div
				className="chat-body w-full  p-4 flex-1 overflow-y-auto"
				data-theme="bumblebee"
			>
				{isLoading && (
					<>
						<div className="chat chat-start">
							<div className="chat-image avatar">
								<div className="w-10 rounded-full animate-pulse bg-slate-800/30"></div>
							</div>

							<div className="chat-bubble animate-pulse bg-slate-800/30 w-1/4"></div>
						</div>

						<div className="chat chat-end">
							<div className="chat-image avatar">
								<div className="w-10 rounded-full animate-pulse bg-slate-800/30"></div>
							</div>

							<div className="chat-bubble animate-pulse bg-slate-800/30 w-1/4"></div>
						</div>
						<div className="chat chat-start">
							<div className="chat-image avatar">
								<div className="w-10 rounded-full animate-pulse bg-slate-800/30"></div>
							</div>

							<div className="chat-bubble animate-pulse bg-slate-800/30 w-1/4"></div>
						</div>

						<div className="chat chat-end">
							<div className="chat-image avatar">
								<div className="w-10 rounded-full animate-pulse bg-slate-800/30"></div>
							</div>

							<div className="chat-bubble animate-pulse bg-slate-800/30 w-1/4"></div>
						</div>
					</>
				)}

				{!isLoading && !ChatContainer?.length && (
					<>
						<h1>no chat initialize yet</h1>
					</>
				)}

				{!isLoading &&
					ChatContainer?.length > 0 &&
					ChatContainer?.map((message: MessageType) => {
						return message.senderId === SelectUserChat?._id ? (
							<div className="chat chat-start" key={message._id}>
								<div className="chat-image avatar">
									<div className="w-10 rounded-full">
										<img
											alt={SelectUserChat.firstName}
											src={SelectUserChat.profilePic}
										/>
									</div>
								</div>
								<div className="chat-header">
									{SelectUserChat.firstName}
									<time className="text-xs opacity-50">
										{new Date(message.createdAt).toLocaleTimeString(undefined, {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</time>
								</div>
								{message.message ? (
									<div className="chat-bubble  break-all">
										{message.message}
									</div>
								) : (
									<img
										src={message?.image}
										width={150}
										height={200}
										className="border-2  p-2  border-indigo-600 rounded-lg"
									/>
								)}

								<div className="chat-footer opacity-50">Delivered</div>
							</div>
						) : (
							<div className="chat chat-end" key={message._id}>
								<div className="chat-image avatar">
									<div className="w-10 rounded-full">
										<img alt={userInfo?.firstName} src={userInfo?.profilePic} />
									</div>
								</div>
								<div className="chat-header">
									{userInfo?.firstName}
									<time className="text-xs opacity-50">
										{new Date(message.createdAt).toLocaleTimeString(undefined, {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</time>
								</div>
								{message.message ? (
									<div className="chat-bubble  break-all">
										{message.message}
									</div>
								) : (
									<img
										src={message?.image}
										width={150}
										height={200}
										className="border-2  p-2  border-indigo-600 rounded-lg"
									/>
								)}

								<div className="chat-footer opacity-50">Delivered</div>
							</div>
						);
					})}
				<div ref={chatBody} />
			</div>
			<MessageInput />
		</div>
	);
};

export default ChatContainer;
