import { Injectable } from '@nestjs/common';
import { ChatRole } from './chat-role.model';
import { ChatRoleRepository } from './chat-role.repository';
import { SnatchedLogger } from '../../core/services/snatched-logger/logger.service';
import handleError from 'src/core/utils/errorHandler';

@Injectable()
export class ChatRoleService {
	constructor(
		private readonly chatRoleRepository: ChatRoleRepository,
		private readonly logger: SnatchedLogger
	) {}

	public async createChatRole(roleDto: ChatRole): Promise<ChatRole> {
		const loggerContext = `${ChatRoleRepository.name}/${this.createChatRole.name}`;

		try {
			return await this.chatRoleRepository.createChatRole(roleDto);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
