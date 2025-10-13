import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * QueryProviderHook
 *
 * Provides a React Query client to the application.
 *
 * @param {{ children: React.ReactNode }} props - The children components to be rendered within the provider.
 * @returns {JSX.Element} The rendered children components wrapped in a QueryClientProvider.
 */
const QueryProviderHook = ({ children }: { children: React.ReactNode }) => {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

export default QueryProviderHook;
