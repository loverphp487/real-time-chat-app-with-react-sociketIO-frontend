import { setSelectTab } from '@/slices/chatSlice';
import type { RootState } from '@/store';
import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

type TabType = 'chats' | 'contacts';

/**
 * ActiveTabSwitch is a component that displays two buttons: 'Chats' and 'Contacts'.
 * The component uses the SelectTab atom from the chat settings state to determine which button to display as active.
 * When the 'Chats' button is active, the button is displayed with a cyan background and border, and the text is white.
 * When the 'Contacts' button is active, the button is displayed with a cyan background and border, and the text is white.
 * When the button is not active, the button is displayed with a cyan border and slate-400 text.
 * The component uses the useDispatch hook from react-redux to dispatch the setSelectTab action, which updates the SelectTab atom in the chat settings state.
 */
const ActiveTabSwitch = () => {
	const dispatch = useDispatch();
	const { SelectTab } = useSelector((state: RootState) => state.chats);
	const queryClient = useQueryClient();

	const handelSelectTab = (tab: TabType) => {
		if (tab === 'chats') {
			dispatch(setSelectTab('chats'));
			queryClient.removeQueries({
				queryKey: ['get-all-contact-list'],
			});
		} else {
			dispatch(setSelectTab('contacts'));
			queryClient.removeQueries({
				queryKey: ['get-all-chat-list'],
			});
		}
	};
	return (
		<div className=" p-2 w-full  flex items-center gap-2">
			<button
				className={classNames('btn flex-1', {
					'btn-active bg-cyan-800 border-cyan-400': SelectTab === 'chats',
					'btn-outline border-cyan-800 text-slate-400': SelectTab !== 'chats',
				})}
				onClick={() => handelSelectTab('chats')}
			>
				Chats
			</button>
			<button
				className={classNames('btn flex-1 ', {
					'btn-active bg-cyan-800 border-cyan-400': SelectTab === 'contacts',
					'btn-outline border-cyan-800 text-slate-400':
						SelectTab !== 'contacts',
				})}
				onClick={() => handelSelectTab('contacts')}
			>
				Contacts
			</button>
		</div>
	);
};

export default ActiveTabSwitch;
