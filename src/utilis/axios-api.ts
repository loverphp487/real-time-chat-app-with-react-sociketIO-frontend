import axios from 'axios';
import Cookies from 'js-cookie';

interface CustomError extends Error {
	errorCode?: string;
}

const token = Cookies.get('token');

const API = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		authorization: token ? `Bearer ${token}` : '',
	},
});

API.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error: Error | any) => {
		if (!error.response) {
			// Network error: No response from the server
			//console.error('Network Error:', error); // Log the error
			// Implement your network error handling here, such as:
			// - Displaying a user-friendly message
			// - Retrying the request
			// - Logging the error
			// - Sending error information to analytics
			return Promise.reject({
				...error,
				message: 'Network Error: OR Backend Server is Down',
			}); // Important: Re-reject the promise to propagate the error
		}

		const { data, status } = error.response;

		if (data.message.startsWith('Unauthorized') && status === 401) {
			sessionStorage.clear();
			localStorage.clear();
			// Cookies.remove('token');
			window.location.href = '/login';
			return;
		}

		const customError: CustomError = {
			...error,
			errorCode: status || 'UNKNOWN_ERROR',
		};

		return Promise.reject(customError);
	},
);

export default API;
