import { Injectable } from '@nestjs/common';
import { SnatchedService } from '../snatched-logger/logger.service';
import { RealTimeChatService } from './modules/real-time-chat/real-time-chat.service';
import { ChatType } from './types/chat.type';
import { AbstractChatService } from './abstractions/chat-service';
import handleError from 'src/core/utils/errorHandler';

type MessageBody = {
	text?: string;
	photo?: string;
	video?: string;
	audio?: string;
};

type MessageFrom = {
	id: string;
	username: string;
};

type MessageChat = {
	id: string;
	name: string;
	type: ChatType;
};

type MessagePayload = {
	message: MessageBody;
	chat: MessageChat;
};

type MessageContext = MessagePayload & {
	from: MessageFrom;
};

type MessageRdo = MessageContext & {
	id: string;
	timestamp: number;
	edited?: number;
};

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
