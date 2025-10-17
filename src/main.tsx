import '@/index.css';
import QueryProviderHook from '@/provider/query-provider';
import ReduxProvider from '@/provider/redux-provider';
import router from '@/router/index.tsx';
import { CookiesProvider } from 'react-cookie';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(
	<CookiesProvider defaultSetOptions={{ path: '/' }}>
		<QueryProviderHook>
			<ReduxProvider>
				<RouterProvider router={router} />
				<ToastContainer
					pauseOnFocusLoss={false}
					pauseOnHover={true}
					autoClose={1500}
				/>
			</ReduxProvider>
		</QueryProviderHook>
	</CookiesProvider>,
);
