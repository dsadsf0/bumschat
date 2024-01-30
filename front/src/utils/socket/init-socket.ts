import { SERVER_SOCKET_URI } from '@/api';
import { io, Socket } from 'socket.io-client';

type MessageBody = {
    text?: string;
    photo?: string;
    video?: string;
    audio?: string;
};

type MessageFrom = {
    id: string;
    username: string;
};

type MessageChat = {
    id: string;
    name: string;
    type: 'RTChat';
};

export type MessagePayload = {
    message: MessageBody;
    chat: MessageChat;
};

export type Message = MessagePayload & {
    from: MessageFrom;
    id: string;
    timestamp: number;
    edited?: number;
};

type Emits = {
    ['chat-message'](payload: MessagePayload): void;
};

type Listeners = {
    ['chat-message'](payload: Message): void;
};

export type SocketClient = Socket<Listeners, Emits>;

export const socket: SocketClient = io(SERVER_SOCKET_URI, {
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
