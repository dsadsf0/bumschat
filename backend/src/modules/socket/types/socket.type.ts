import { Server, Socket } from 'socket.io';
import { UserGetRdo } from 'src/modules/user/rdo/get-user.rdo';

type ClientEmits = {
	['test'](payload: string): void;
};
type EmptyObject = { [key in string]: never };

type ClientData = {
	user: UserGetRdo;
	publicKey: string;
};

export type SocketServer = Server<EmptyObject, ClientEmits, EmptyObject, ClientData>;
export type SocketClient = Socket<EmptyObject, ClientEmits, EmptyObject, ClientData>;
