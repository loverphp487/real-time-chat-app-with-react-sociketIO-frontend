import type { MessageType, UserType } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ChatState {
	SelectTab: 'chats' | 'contacts';
	SelectUserChat?: UserType;
	ChatContainer: MessageType[];
}

const initialState: ChatState = {
	SelectTab: 'chats',
	SelectUserChat: undefined,
	ChatContainer: [],
};

export const chatsSlice = createSlice({
	name: 'chat-settings',
	initialState,
	reducers: {
		/**
		 * Sets the selected tab in the chat settings state.
		 * @param {ChatState} state - The current chat settings state.
		 * @param {PayloadAction<ChatState>} action - The action to set the selected tab.
		 * @returns {void} - Nothing is returned.
		 */
		setSelectTab: (
			state: ChatState,
			action: PayloadAction<'chats' | 'contacts'>,
		) => {
			state.SelectTab = action.payload;
		},

		/**
		 * Sets the selected user in the chat settings state.
		 * The selected user is used to determine which tab to display.
		 * If the selected user is undefined, the 'chats' tab is displayed.
		 * If the selected user is defined, the 'contacts' tab is displayed and the chat container is populated with the messages between the current user and the selected user.
		 * @param {ChatState} state - The current chat settings state.
		 * @param {PayloadAction<UserType>} action - The action to set the selected user.
		 */
		SetSelectUserChat: (state: ChatState, action: PayloadAction<UserType>) => {
			state.SelectUserChat = action.payload;
		},

		/**
		 * Clears the selected user in the chat settings state.
		 * This is used to reset the selected user when the user navigates away from the chat page.
		 */
		ClearUserSelect: (state: ChatState) => {
			state.SelectUserChat = undefined;
		},

		/**
		 * Sets the chat container state to the messages specified by the action's payload.
		 * This is used to populate the chat container with the messages between the current user and the selected user.
		 * @param {ChatState} state - The current chat settings state.
		 * @param {PayloadAction<MessageType[]>} action - The action to set the chat container state.
		 * @returns {void} - Nothing is returned.
		 */
		SetChatContainer: (
			state: ChatState,
			action: PayloadAction<MessageType[]>,
		) => {
			state.ChatContainer = action.payload;
		},
	},
});

export const {
	setSelectTab,
	SetSelectUserChat,
	ClearUserSelect,
	SetChatContainer,
} = chatsSlice.actions;

export default chatsSlice.reducer;
