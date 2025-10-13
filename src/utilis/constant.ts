import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

const token = Cookies.get('token');

const socket: Socket = io(import.meta.env.VITE_BASE_URL, {
	withCredentials: true,
	autoConnect: true,
	auth: {
		token: token,
	},
});

export default socket;
