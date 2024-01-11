import { Injectable } from '@nestjs/common';
import { SnatchedService } from '../snatched-logger/logger.service';
import { RealTimeChatService } from './modules/real-time-chat/real-time-chat.service';
import { MessageContext, MessageRdo } from './types/message.type';
import handleError from 'src/core/utils/errorHandler';
import { ChatType } from '../chat/types/chat.type';
import { AbstractChatMessageService } from './abstractions/chat-service';

@Injectable()
export class ChatMessageService {
	private chatService: Record<ChatType, AbstractChatMessageService>;

	constructor(
		private readonly logger: SnatchedService,
		realTimeChatService: RealTimeChatService
	) {
		this.chatService = {
			StandardChat: realTimeChatService,
			RTChat: realTimeChatService,
			OOChat: realTimeChatService,
		};
	}

	public async treatMessage(ctx: MessageContext): Promise<MessageRdo> {
		const loggerContext = `${ChatMessageService.name}/${this.treatMessage.name}`;

		try {
			return await this.chatService[ctx.chat.type].treatMessage(ctx);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
