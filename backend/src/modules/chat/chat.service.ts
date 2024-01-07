import { Injectable } from '@nestjs/common';
import { SnatchedService } from '../snatched-logger/logger.service';
import { RealTimeChatService } from './modules/real-time-chat/real-time-chat.service';
import { ChatType } from './types/chat.type';
import { AbstractChatService } from './abstractions/chat-service';
import handleError from 'src/core/utils/errorHandler';
import { MessageContext, MessageRdo } from './types/message.type';

@Injectable()
export class ChatService {
	private chatService: Record<ChatType, AbstractChatService>;

	constructor(
		realTimeChatService: RealTimeChatService,
		private readonly logger: SnatchedService
	) {
		this.chatService = {
			StandardChat: realTimeChatService,
			RTChat: realTimeChatService,
			OOChat: realTimeChatService,
		};
	}

	public async treatMessage(ctx: MessageContext): Promise<MessageRdo> {
		const loggerContext = `${ChatService.name}/${this.treatMessage.name}`;

		try {
			return await this.chatService[ctx.chat.type].treatMessage(ctx);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
