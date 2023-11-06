import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CryptoService } from '../crypto/crypto.service';
import { SnatchedService } from '../snatchedLogger/logger.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketService {
	constructor(
		private readonly userService: UserService,
		private readonly crypt: CryptoService,
		private readonly logger: SnatchedService
	) {}

	async authMiddleware(client: Socket): Promise<void> {
		const encryptedToken = client.handshake.auth.token as string;

		console.log(encryptedToken);

		if (!encryptedToken) {
			throw new WsException(`Client with id: ${client.id} does not have token!`);
		}

		try {
			const token = this.crypt.decrypt(encryptedToken);
			console.log(token);
		} catch (error) {
			throw new WsException(`Client with id: ${client.id} have invalid token!`);
		}

		const [token, username] = this.crypt.decrypt(encryptedToken).split('_');
		if (!token || !username) {
			throw new WsException(`Client with id: ${client.id} have invalid token!`);
		}

		const user = await this.userService.getUserByToken(token);

		if (user.username !== username) {
			throw new WsException(`Client with id: ${client.id} have invalid token!`);
		}

		client.data.user = user;
	}
}
