import type { UserType } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
	userInfo: UserType;
}

const initialState: Partial<AuthState> = {
	userInfo: undefined,
};

export const AuthSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		/**
		 * Sets the current user information in the state.
		 * @param {Partial<AuthState>} state - The current state.
		 * @param {PayloadAction<UserType>} action - The action to set the user information.
		 * @returns {void} - Nothing is returned.
		 */
		setCredintials: (
			state: Partial<AuthState>,
			action: PayloadAction<UserType>,
		) => {
			state.userInfo = action.payload;
		},
		/**
		 * Logs out the user by setting the user information in the state to undefined.
		 *
		 * @param {Partial<AuthState>} state - The current state.
		 * @returns {void} - Nothing is returned.
		 */
		Logout: (state: Partial<AuthState>) => {
			state.userInfo = undefined;
		},
	},
});

export const { setCredintials, Logout } = AuthSlice.actions;

export default AuthSlice.reducer;
