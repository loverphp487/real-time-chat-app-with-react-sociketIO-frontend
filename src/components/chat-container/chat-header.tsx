import { ClearUserSelect } from '@/slices/chatSlice';
import type { RootState } from '@/store';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * ChatHeader component that displays the chat header.
 * It displays the user's profile picture, name, and status.
 * It also displays a button to clear the selected user.
 */
const ChatHeader = () => {
	const dispatch = useDispatch();
	const { SelectUserChat } = useSelector((state: RootState) => state.chats);
	return (
		<div
			className="chat-header w-full px-6  py-4 border-b border-slate-600/30 "
			data-theme="dark"
		>
			<div className="flex w-full h-full items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="avatar avatar-online  group cursor-pointer">
						<div className="w-12 rounded-full relative">
							<img
								src={SelectUserChat?.profilePic}
								alt={SelectUserChat?.firstName}
								className="size-full object-cover"
							/>
						</div>
					</div>
					<div>
						<h1 className="text-slate-400 max-w-30 truncate">
							{SelectUserChat?.firstName}
						</h1>
						<p className="text-slate-400 text-xs">online</p>
					</div>
				</div>
				<button
					onClick={() => {
						dispatch(ClearUserSelect());
					}}
					className="text-slate-400 hover:text-slate-100 cursor-pointer transition-colors duration-300"
				>
					<X className="size-5 " />
				</button>
			</div>
		</div>
	);
};

export default ChatHeader;
