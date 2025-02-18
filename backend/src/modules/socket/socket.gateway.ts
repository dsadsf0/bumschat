import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { SnatchedLogger } from '../../core/services/snatched-logger/logger.service';
import { WsException } from '@nestjs/websockets/errors/ws-exception';
import { config } from 'dotenv';
import { SocketService } from './socket.service';
import { SocketClient, SocketServer } from './types/socket.type';
import { MessageContext, MessagePayload } from '../chat-message/types/message.type';
import { UserGetRdo } from '../user/rdo/get-user.rdo';
import { ErrorHandler } from 'src/core/decorators/errorHandler.decorator';
config({ path: `.${process.env.NODE_ENV}.env` });

const SOCKET_PORT = Number(process.env.SOCKET_PORT);

@WebSocketGateway(SOCKET_PORT, {
    namespace: 'chat',
    path: '/chat',
    cors: { origin: '*' },
    cookie: true,
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    constructor(
        private readonly socketService: SocketService,
        private readonly logger: SnatchedLogger
    ) {}

    @WebSocketServer()
    private readonly server: SocketServer;

    public afterInit(): void {
        const loggerContext = `${SocketGateway.name}/${this.afterInit.name}`;
        this.logger.debug(`SocketGateway started on Port ${SOCKET_PORT}`, loggerContext);

        this.server.use(this.authMiddleware);
    }

    private authMiddleware = async (client: SocketClient, next: (err?: WsException | Error) => void): Promise<void> => {
        const loggerContext = `${SocketGateway.name}/authMiddleware`;

        try {
            this.logger.info(`Client with id: ${client.id} try to connect.`, loggerContext);
            await this.socketService.authMiddleware(client);
        } catch (error) {
            this.logger.error(error, loggerContext);
        } finally {
            next();
        }
    };

    private adapterToMessageContext(payload: MessagePayload, user: UserGetRdo): MessageContext {
        return {
            ...payload,
            from: {
                id: user.id,
                username: user.username,
            },
        };
    }

    @ErrorHandler(SocketGateway.name)
    public async handleConnection(client: SocketClient): Promise<void> {
        const loggerContext = `${SocketGateway.name}/${this.handleConnection.name}`;

        const user = client.data.user;

        if (!user) {
            throw new WsException(`Client with id: ${client.id} disconnected! Unauthorized.`);
        }

        this.logger.info(`New connection ${user.username} with socket id: ${client.id}!`, loggerContext, {
            logEntityId: user.id,
            tagInMessage: user.username,
        });

        const userChats = client.data.user.chats;

        if (!userChats.length) {
            return;
        }

        client.join(userChats);
    }

    @ErrorHandler(SocketGateway.name)
    public async handleDisconnect(client: SocketClient): Promise<void> {
        const loggerContext = `${SocketGateway.name}/${this.handleDisconnect.name}`;

        const { user } = client.data;

        if (user) {
            this.logger.info(`Disconnected ${user.username} with socket id: ${client.id}!`, loggerContext, {
                logEntityId: user.id,
                tagInMessage: user.username,
            });
        }
    }

    @SubscribeMessage('chat-message')
    @ErrorHandler(SocketGateway.name)
    public async message(@MessageBody() ctx: MessagePayload, @ConnectedSocket() client: SocketClient): Promise<void> {
        const msgContext = this.adapterToMessageContext(ctx, client.data.user);
        const treatedMessage = await this.socketService.treatMessage(msgContext);

        const groupUsers = await this.server.in(ctx.chat.id).fetchSockets();

        for (const chatUser of groupUsers) {
            const userMessageRdo = this.socketService.encryptMessageRdo(treatedMessage, chatUser.data.publicKey);
            this.server.to(chatUser.id).emit('chat-message', userMessageRdo);
        }
    }
}
