import { setSelectTab } from '@/slices/chatSlice';
import { MessageCircleIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';

/**
 * A component that displays a message indicating that no conversations have been found.
 * It displays a message circle icon, a heading, a paragraph of text, and a button to find contacts.
 * The component is intended to be used when no conversations are found in the application.
 */
const NoChatsFound = () => {
	const dispatch = useDispatch();
	return (
		<div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
			<div className="size-16 rounded-full bg-cyan-500/10 flex items-center justify-center">
				<MessageCircleIcon className="w-8 h-8 text-cyan-400" />
			</div>
			<div className="space-y-1">
				<h4 className="text-slate-300 font-medium capitalize">
					No users register yet
				</h4>
				<p className="text-slate-400 text-sm px-6">
					Start a new chat by selecting a contact from the contacts tab
				</p>
			</div>
			<button
				onClick={() => {
					dispatch(setSelectTab('contacts'));
				}}
				className="px-4 py-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer transition-colors rounded-lg"
			>
				Find contacts
			</button>
		</div>
	);
};

export default NoChatsFound;
