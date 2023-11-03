import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SnatchedService } from '../snatchedLogger/logger.service';
import { Server, Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets/errors/ws-exception';
import handleError from 'src/core/utils/errorHandler';
import { config } from 'dotenv';
import { SocketService } from './socket.service';
config({ path: `.${process.env.NODE_ENV}.env` });

const SOCKET_PORT = Number(process.env.SOCKET_PORT) || 2002;

@WebSocketGateway(SOCKET_PORT, {
	namespace: '/chat',
	cors: { origin: '*' },
	cookie: true,
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
	constructor(
		private readonly socketService: SocketService,
		private readonly logger: SnatchedService
	) {}

	@WebSocketServer()
	private readonly server: Server;

	public afterInit(): void {
		const loggerContext = `${SocketGateway.name}/${this.afterInit.name}`;
		this.logger.debug(`SocketGateway started on Port ${SOCKET_PORT}`, loggerContext);

		this.server.use(this.authMiddleware);
	}

	private authMiddleware = async (client: Socket, next: (err?: WsException | Error) => void): Promise<void> => {
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

	public async handleConnection(client: Socket): Promise<void> {
		const loggerContext = `${SocketGateway.name}/${this.handleConnection.name}`;

		try {
			const user = client.data.user;

			if (!user) {
				throw new WsException(`Client with id: ${client.id} disconnected! Unauthorized.`);
			}

			this.logger.info(`New connection ${user.username} with socket id: ${client.id}!`, loggerContext, user.username);
		} catch (error) {
			this.logger.error(error, loggerContext);
			client.disconnect();
		}
	}

	public async handleDisconnect(client: Socket): Promise<void> {
		const loggerContext = `${SocketGateway.name}/${this.handleDisconnect.name}`;

		try {
			const { user } = client.data;

			if (user) {
				this.logger.info(`Disconnected ${user.username} with socket id: ${client.id}!`, loggerContext, user.username);
			}
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
