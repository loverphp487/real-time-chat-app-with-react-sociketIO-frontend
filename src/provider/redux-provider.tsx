import { persistor, store } from '@/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

/**
 * A wrapper component that provides the React Redux store to its children.
 * It uses the `PersistGate` component from `redux-persist` to persist the store
 * across page reloads.
 *
 * @param {{ children: React.ReactNode }} props - The children components to be rendered within the provider.
 * @returns {JSX.Element} The rendered children components wrapped in a `Provider` and `PersistGate`.
 */
const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>{children}</PersistGate>
		</Provider>
	);
};

export default ReduxProvider;
