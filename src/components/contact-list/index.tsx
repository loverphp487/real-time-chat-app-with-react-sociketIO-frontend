import { SetChatContainer, SetSelectUserChat } from '@/slices/chatSlice';
import type { UserType } from '@/types';
import API from '@/utilis/axios-api';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NoContactsFound from '../NoContactsFound';
import UsersLoadingSkeleton from '../UsersLoadingSkeleton';
import type { RootState } from '@/store';
import classNames from 'classnames';

/**
 * A component that displays a list of contacts.
 * It fetches the list of contacts from the API and displays them in a scrollable list.
 * If there is an error, it displays the error message.
 * If the list is loading, it displays a loading skeleton.
 * If the list is empty, it displays a 'No contacts found' message.
 */
const ContactList = () => {
	const dispatch = useDispatch();
	const [contactList, setContactList] = useState<UserType[]>([]);
	const { SelectUserChat } = useSelector((state: RootState) => state.chats);

	const { error, isLoading } = useQuery({
		queryKey: ['get-all-contact-list'],
		/**
		 * Fetches the list of chats from the API and sets the chat list state to the response data.
		 * The response data is expected to contain a 'users' property with an array of user objects.
		 * If the response data does not contain the 'users' property, the chat list state is not updated.
		 */
		queryFn: async () =>
			await API.get('/chats/all-contact-list').then(({ data }) => {
				setContactList(data?.users);
				return data;
			}),
	});

	if (error) return <p className="text-slate-500">{error.message}</p>;

	useEffect(() => {
		return () => {
			setContactList([]);
		};
	}, []);

	return (
		<div
			className="w-full h-full p-4 space-y-4 flex-1 flex-col  overflow-y-auto overflow-x-hidden"
			data-theme="dark"
		>
			{isLoading && <UsersLoadingSkeleton />}
			{!isLoading &&
				contactList?.length > 0 &&
				contactList.map((user) => (
					<div
						key={user._id}
						className={classNames(
							'p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 cursor-pointer transition-colors duration-300 group',
							{
								'bg-cyan-500/50! ':
									user._id.toString() === SelectUserChat?._id.toString(),
							},
						)}
						onClick={() => {
							dispatch(SetSelectUserChat(user));
							dispatch(SetChatContainer([]));
						}}
					>
						<div className="flex items-center gap-4">
							<div className={clsx('avatar')}>
								<div className="w-10 rounded-full">
									<img src={user.profilePic} alt={user.firstName} />
								</div>
							</div>
							<h1
								className={classNames(
									'text-slate-400 group-hover:text-slate-300 transition-colors duration-300',
									{
										'text-slate-300!':
											user._id.toString() === SelectUserChat?._id.toString(),
									},
								)}
							>
								{user.firstName}
							</h1>
						</div>
					</div>
				))}

			{!isLoading && !contactList?.length && <NoContactsFound />}
		</div>
	);
};

export default memo(ContactList);
