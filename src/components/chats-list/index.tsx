import { SetChatContainer, SetSelectUserChat } from '@/slices/chatSlice';
import type { UserType } from '@/types';
import API from '@/utilis/axios-api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NoChatsFound from '../NoChatsFound';
import UsersLoadingSkeleton from '../UsersLoadingSkeleton';
import type { RootState } from '@/store';
import classNames from 'classnames';

/**
 * ChatsList is a component that displays a list of chats.
 * It fetches the list of chats from the API and displays them in a scrollable list.
 * If there is an error, it displays the error message.
 * If the list is loading, it displays a loading skeleton.
 * If the list is empty, it displays a 'No chats found' message.
 */
const ChatsList = () => {
	const dispatch = useDispatch();
	const queryClinet = useQueryClient();
	const { SelectUserChat } = useSelector((state: RootState) => state.chats);
	const [chatList, setChatList] = useState<UserType[]>([]);

	const { error, isLoading } = useQuery({
		queryKey: ['get-all-chat-list'],
		/**
		 * Fetches the list of chats from the API and sets the chat list state to the response data.
		 * The response data is expected to contain a 'users' property with an array of user objects.
		 * If the response data does not contain the 'users' property, the chat list state is not updated.
		 */
		queryFn: async () =>
			await API.get('/chats/all-chat-list').then(({ data }) => {
				setChatList(data?.users);
				return data;
			}),
	});

	if (error) return <p className="text-slate-500">{error.message}</p>;

	const opendChatConversation = (user: UserType) => {
		dispatch(SetSelectUserChat(user));
		dispatch(SetChatContainer([]));
		queryClinet.resetQueries({
			queryKey: ['conversations', user._id],
		});
	};

	useEffect(() => {
		return () => {
			setChatList([]);
		};
	}, []);

	return (
		<div
			className="w-full h-full p-4 space-y-4 flex-1 flex-col  overflow-y-auto overflow-x-hidden"
			data-theme="dark"
		>
			{isLoading && <UsersLoadingSkeleton />}
			{!isLoading &&
				chatList?.length > 0 &&
				chatList?.map((user) => (
					<div
						key={user._id}
						className={classNames(
							'p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 cursor-pointer transition-colors duration-300 group',
							SelectUserChat?._id === user._id && 'bg-cyan-800!',
						)}
						onClick={() => {
							opendChatConversation(user);
						}}
					>
						<div className="flex items-center gap-4">
							<div className={clsx('avatar')}>
								<div className="w-10 rounded-full">
									<img src={user.profilePic} />
								</div>
							</div>
							<h1 className="text-slate-400 group-hover:text-slate-300 truncate transition-colors duration-300">
								{user.firstName}
							</h1>
						</div>
					</div>
				))}

			{!isLoading && !chatList?.length && <NoChatsFound />}
		</div>
	);
};

export default ChatsList;
