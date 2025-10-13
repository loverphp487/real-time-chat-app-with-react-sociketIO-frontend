import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import '@/index.css';
import router from '@/router/index.tsx';
import QueryProviderHook from '@/provider/query-provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReduxProvider from '@/provider/redux-provider';
import { CookiesProvider } from 'react-cookie';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<CookiesProvider defaultSetOptions={{ path: '/' }}>
			<QueryProviderHook>
				<ReduxProvider>
					<RouterProvider router={router} />
					<ToastContainer
						pauseOnFocusLoss={false}
						pauseOnHover={true}
						autoClose={1500}
						stacked
					/>
				</ReduxProvider>
			</QueryProviderHook>
		</CookiesProvider>
	</StrictMode>,
);
