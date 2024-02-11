import { SERVER_SOCKET_URI } from '@/api';
import { io, Socket } from 'socket.io-client';
import cryptService from '../crypt/crypt-service';
import { UserService } from '@/api/services/UserService';

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
    reconnection: false,
});

const connectToSocket = (encryptedToken: string, publicKey: string): void => {
    socket.auth = { token: encryptedToken, publicKey };
    socket.connect();
};

const getAndTreatToken = async (username: string): Promise<{ token: string; publicKey: string }> => {
    const clientPublicKey = cryptService.getPublicKey();
    const encryptublicKey = await UserService.getPublicKey();
    cryptService.setEncryptKey(encryptublicKey);
    const { token: userToken, publicKey: serverPublicKey } = await UserService.getToken(clientPublicKey);
    const token = cryptService.decrypt(userToken);
    return {
        token: cryptService.encryptByKey(`${token}_${username}`, serverPublicKey),
        publicKey: clientPublicKey,
    };
};

let retries = 0;
const RECONNECTION_MAX_RETRIES = 60;
const RECONNECTION_DELAY_MSEC = 5000;
const retryInitUserSocketConnection = (username: string): void => {
    if (retries < RECONNECTION_MAX_RETRIES) {
        retries += 1;
        setTimeout(async (): Promise<void> => {
            try {
                const { token, publicKey } = await getAndTreatToken(username);
                connectToSocket(token, publicKey);
            } catch (error) {
                setTimeout(() => retryInitUserSocketConnection(username), RECONNECTION_DELAY_MSEC);
            }
        }, RECONNECTION_DELAY_MSEC);
    }
};

export const initUserSocketConnection = async (username: string): Promise<void> => {
    const { token, publicKey } = await getAndTreatToken(username);
    connectToSocket(token, publicKey);

    socket.on('disconnect', () => retryInitUserSocketConnection(username));
    socket.on('disconnect', () => {
        retries = 0;
    });
};
