import { SERVER_SOCKET_URI } from '@/api';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io(SERVER_SOCKET_URI, {
	path: '/chat',
	autoConnect: false,
	reconnection: false,
});

export const initSocket = (encryptedToken: string, publicKey: string): void => {
	socket.auth = { token: encryptedToken, publicKey };
	socket.connect();

	socket.on('connection', () => {});
	console.log('socket', socket);
};

export const getSocket = async (): Promise<Socket> => {
	if (socket.connected) {
		return socket;
	}
	throw new Error('Unauthorized or socket is not initialized.');
};
