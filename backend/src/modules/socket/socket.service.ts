import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CryptoService } from '../crypto/crypto.service';
import { SnatchedLogger } from '../../core/services/snatched-logger/logger.service';
import { WsException } from '@nestjs/websockets';
import { SocketClient } from './types/socket.type';
import handleError from 'src/core/utils/errorHandler';
import { ChatMessageService } from '../chat-message/chat-message.service';
import { MessageContext, MessageRdo } from '../chat-message/types/message.type';

@Injectable()
export class SocketService {
	constructor(
		private readonly userService: UserService,
		private readonly chatMessageService: ChatMessageService,
		private readonly crypt: CryptoService,
		private readonly logger: SnatchedLogger
	) {}

	public async authMiddleware(client: SocketClient): Promise<void> {
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

		const user = (await this.userService.getUsersByToken(token)).find((user) => user.username === username);

		if (!user) {
			throw new WsException(`Client with id: ${client.id} have invalid token!`);
		}

		client.data.user = user;
		client.data.publicKey = publicKey;
	}

	private decryptMessageContext(ctx: MessageContext): MessageContext {
		const loggerContext = `${SocketService.name}/${this.decryptMessageContext.name}`;
		try {
			return {
				...ctx,
				message: {
					...ctx.message,
					text: this.crypt.decrypt(ctx.message.text),
				},
			};
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async treatMessage(ctx: MessageContext): Promise<MessageRdo> {
		const loggerContext = `${SocketService.name}/${this.treatMessage.name}`;

		try {
			const decryptedMsgContext = this.decryptMessageContext(ctx);
			const treatedMessage = await this.chatMessageService.treatMessage(decryptedMsgContext);

			return treatedMessage;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public encryptMessageRdo(msg: MessageRdo, userPublicKey: string): MessageRdo {
		const loggerContext = `${SocketService.name}/${this.encryptMessageRdo.name}`;

		try {
			return {
				...msg,
				message: {
					...msg.message,
					text: this.crypt.encrypt(msg.message.text, userPublicKey),
				},
			};
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
