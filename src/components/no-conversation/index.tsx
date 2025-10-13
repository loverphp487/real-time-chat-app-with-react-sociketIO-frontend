import { MessageCircleIcon } from 'lucide-react';

const NoConversationPlaceholder = () => {
	return (
		<div className="w-full h-full flex flex-col items-center justify-center text-center space-y-5">
			<div className="size-20 bg-cyan-500/25 rounded-full flex items-center justify-center">
				<MessageCircleIcon className="text-cyan-500 size-10" />
			</div>
			<h3 className="text-xl text-slate-200 font-semibold">
				Select a conversation
			</h3>
			<p className="text-slate-400 max-w-md">
				Choose a contact from the sidebar to start chatting or continue a
				previous conversation.
			</p>
		</div>
	);
};

export default NoConversationPlaceholder;
