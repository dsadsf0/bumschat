import { ChatService } from './../chat/chat.service';
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
import { SnatchedService } from '../snatched-logger/logger.service';
import { WsException } from '@nestjs/websockets/errors/ws-exception';
import handleError from 'src/core/utils/errorHandler';
import { config } from 'dotenv';
import { SocketService } from './socket.service';
import { SocketClient, SocketServer } from './types/socket.type';
import { MessagePayload } from '../chat/types/message.type';
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
		private readonly logger: SnatchedService
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

	public async handleConnection(client: SocketClient): Promise<void> {
		const loggerContext = `${SocketGateway.name}/${this.handleConnection.name}`;

		try {
			const user = client.data.user;

			if (!user) {
				throw new WsException(`Client with id: ${client.id} disconnected! Unauthorized.`);
			}

			this.logger.info(`New connection ${user.username} with socket id: ${client.id}!`, loggerContext, user.username, user.id);

			const userChats = ['mock-id'];
			// const userChats = await this.socketService.getUserChats(user.id);

			if (!userChats.length) {
				return;
			}

			client.join(userChats);
		} catch (error) {
			this.logger.error(error, loggerContext);
			client.disconnect();
		}
	}

	public async handleDisconnect(client: SocketClient): Promise<void> {
		const loggerContext = `${SocketGateway.name}/${this.handleDisconnect.name}`;

		try {
			const { user } = client.data;

			if (user) {
				this.logger.info(`Disconnected ${user.username} with socket id: ${client.id}!`, loggerContext, user.username, user.id);
			}
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	@SubscribeMessage('chat-message')
	public async message(@MessageBody() ctx: MessagePayload, @ConnectedSocket() client: SocketClient): Promise<void> {
		const loggerContext = `${SocketGateway.name}/${this.handleDisconnect.name}`;

		try {
			const treatedMessage = await this.socketService.treatMessage({
				...ctx,
				from: {
					id: client.data.user.id,
					username: client.data.user.username,
				},
			});

			// теперь надо будет для каждого пользователя чата персонально зашифровать текст сообщения
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
