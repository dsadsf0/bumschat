import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CryptoService } from '../crypto/crypto.service';
import { SnatchedService } from '../snatchedLogger/logger.service';
import { WsException } from '@nestjs/websockets';
import { SocketClient } from './types/socket.type';

@Injectable()
export class SocketService {
	constructor(
		private readonly userService: UserService,
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
}
