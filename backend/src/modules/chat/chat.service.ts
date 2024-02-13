import { Injectable } from '@nestjs/common';
import { Chat, ChatDocument } from './chat.model';
import { ChatRepository } from './chat.repository';
import { ChatRoleService } from '../chat-role/chat-role.service';
import { ErrorHandler } from 'src/core/decorators/errorHandler.decorator';

@Injectable()
export class ChatService {
    constructor(
        private readonly chatRepository: ChatRepository,
        private readonly chatRoleService: ChatRoleService
    ) {}

    @ErrorHandler(ChatService.name)
    public async createChat(chatDto: Chat): Promise<ChatDocument> {
        const chat = await this.chatRepository.createChat(chatDto);

        await this.chatRoleService.createChatRole({ chat: chat._id });

        return chat;
    }
}
