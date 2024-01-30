import { Injectable } from '@nestjs/common';
import { SnatchedLogger } from '../../core/services/snatched-logger/logger.service';
import handleError from 'src/core/utils/errorHandler';
import { Chat, ChatDocument } from './chat.model';
import { ChatRepository } from './chat.repository';
import { ChatRoleService } from '../chat-role/chat-role.service';

@Injectable()
export class ChatService {
    constructor(
        private readonly chatRepository: ChatRepository,
        private readonly chatRoleService: ChatRoleService,
        private readonly logger: SnatchedLogger
    ) {}

    public async createChat(chatDto: Chat): Promise<ChatDocument> {
        const loggerContext = `${ChatService.name}/${this.createChat.name}`;
        try {
            const chat = await this.chatRepository.createChat(chatDto);

            await this.chatRoleService.createChatRole({ chat: chat._id });

            return chat;
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }
}
