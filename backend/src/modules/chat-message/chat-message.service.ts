import { Injectable } from '@nestjs/common';
import { SnatchedLogger } from '../../core/services/snatched-logger/logger.service';
import { RealTimeChatService } from './modules/real-time-chat/real-time-chat.service';
import { MessageContext, MessageRdo } from './types/message.type';
import { ChatType } from '../chat/types/chat.type';
import { AbstractChatMessageService } from './abstractions/chat-service';
import { ErrorHandler } from 'src/core/decorators/errorHandler.decorator';

@Injectable()
export class ChatMessageService {
    private chatService: Record<ChatType, AbstractChatMessageService>;

    constructor(
        private readonly logger: SnatchedLogger,
        realTimeChatService: RealTimeChatService
    ) {
        this.chatService = {
            StandardChat: realTimeChatService,
            RTChat: realTimeChatService,
            OOChat: realTimeChatService,
        };
    }

    @ErrorHandler(ChatMessageService.name)
    public async treatMessage(ctx: MessageContext): Promise<MessageRdo> {
        return await this.chatService[ctx.chat.type].treatMessage(ctx);
    }
}
