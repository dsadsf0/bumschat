import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRole } from './chat-role.model';
import { Model } from 'mongoose';
import { SnatchedLogger } from '../../core/services/snatched-logger/logger.service';
import { DEFAULT_CHAT_ROLE_NAME } from 'src/core/consts/roles';
import { ErrorHandler } from 'src/core/decorators/errorHandler.decorator';

@Injectable()
export class ChatRoleRepository {
    constructor(
        @InjectModel(ChatRole.name)
        private readonly chatRoleModel: Model<ChatRole>,
        private readonly logger: SnatchedLogger
    ) {}

    @ErrorHandler(ChatRoleRepository.name)
    public async createChatRole(roleDto: ChatRole): Promise<ChatRole> {
        const chatRole = await this.chatRoleModel
            .findOne({ chat: roleDto.chat, name: roleDto.name || DEFAULT_CHAT_ROLE_NAME })
            .lean();

        if (chatRole) {
            throw new HttpException('Role with this name already exist in this chat', HttpStatus.BAD_REQUEST);
        }

        return await this.chatRoleModel.create(roleDto);
    }
}
