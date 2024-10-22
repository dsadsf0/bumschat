import { Injectable } from '@nestjs/common';
import { ChatRole } from './chat-role.model';
import { ChatRoleRepository } from './chat-role.repository';
import { ErrorHandler } from 'src/core/decorators/errorHandler.decorator';

@Injectable()
export class ChatRoleService {
    constructor(private readonly chatRoleRepository: ChatRoleRepository) {}

    @ErrorHandler(ChatRoleService.name)
    public async createChatRole(roleDto: ChatRole): Promise<ChatRole> {
        return await this.chatRoleRepository.createChatRole(roleDto);
    }
}
