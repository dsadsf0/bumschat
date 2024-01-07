import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CryptoService } from '../crypto/crypto.service';
import { SnatchedService } from '../snatched-logger/logger.service';
import { WsException } from '@nestjs/websockets';
import { SocketClient } from './types/socket.type';
import handleError from 'src/core/utils/errorHandler';
import { ChatService } from '../chat/chat.service';
import { MessageContext, MessageRdo } from '../chat/types/message.type';

@Injectable()
export class SocketService {
	constructor(
		private readonly userService: UserService,
		private readonly chatService: ChatService,
		private readonly crypt: CryptoService,
		private readonly logger: SnatchedService
	) {}

	async authMiddleware(client: SocketClient): Promise<void> {
		const encryptedToken = client.handshake.auth.token as string;
		const publicKey = client.handshake.auth.publicKey as string;

		if (!publicKey) {
			throw new WsException(`Client with id: ${client.id} had not provide publicKey!`);
		}

		if (!encryptedToken) {
			throw new WsException(`Client with id: ${client.id} does not have token!`);
		}

		let token = '';
		let username = '';

		try {
			[token, username] = this.crypt.decrypt(encryptedToken).split('_');
		} catch (error) {
			throw new WsException(`Client with id: ${client.id} have invalid token!`);
		}

		if (!token || !username) {
			throw new WsException(`Client with id: ${client.id} have invalid token!`);
		}

		const user = await this.userService.getUserByToken(token);

		if (user.username !== username) {
			throw new WsException(`Client with id: ${client.id} have invalid token!`);
		}

		client.data.user = user;
		client.data.publicKey = publicKey;
	}

	public async getUserChats(userId: string): Promise<string[]> {
		const loggerContext = `${SocketService.name}/${this.getUserChats.name}`;
		try {
			return await this.userService.getUserChats(userId);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async treatMessage(ctx: MessageContext): Promise<MessageRdo> {
		const loggerContext = `${SocketService.name}/${this.treatMessage.name}`;

		try {
			const treatedMessage = await this.chatService.treatMessage({
				...ctx,
				message: {
					text: this.crypt.decrypt(ctx.message.text),
				},
			});

			return treatedMessage;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
