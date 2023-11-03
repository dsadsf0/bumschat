import { SERVER_SOCKET_URI } from '@/api';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io(SERVER_SOCKET_URI, {
	autoConnect: false,
	reconnection: false,
});

export const initSocket = (encryptedToken: string): void => {
	socket.auth = { token: encryptedToken };
	socket.connect();
	console.log('socket', socket);
	setTimeout(async () => console.log('socket connected :', (await getSocket()).connected), 1000);
};

export const getSocket = async (): Promise<Socket> => {
	if (socket.connected) {
		return socket;
	}
	throw new Error('Unauthorized or socket is not initialized.');
};
