import { Outlet } from 'react-router-dom';
import BaseLayout from './layout/base-layout';

/**
 * The App component is the top-level component for the application.
 * It wraps the Outlet component with the BaseLayout component.
 */
function App() {
	return (
		<BaseLayout>
			<Outlet />
		</BaseLayout>
	);
}

export default App;
