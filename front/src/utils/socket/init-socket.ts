import { SERVER_SOCKET_URI } from '@/api';
import { io, Socket } from 'socket.io-client';

export const socket: Socket = io(SERVER_SOCKET_URI, {
	path: '/chat',
	autoConnect: false,
	retries: 3,
	reconnectionDelay: 5000,
	reconnection: true,
});

export const initSocket = async (encryptedToken: string, publicKey: string): Promise<void> => {
	return new Promise((resolve) => {
		socket.auth = { token: encryptedToken, publicKey };
		socket.connect();

		socket.on('connect', resolve);
	});
};
