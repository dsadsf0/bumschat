import { Injectable } from '@nestjs/common';
import { SnatchedService } from '../snatchedLogger/logger.service';
import { RealTimeChatService } from './modules/real-time-chat/real-time-chat.service';
import { ChatType } from './types/chat.type';

@Injectable()
export class ChatService {
	private chatService: Record<ChatType, object>;

	constructor(
		private readonly logger: SnatchedService,
		private readonly realTimeChatService: RealTimeChatService
	) {
		this.chatService = {
			StandardChat: this.realTimeChatService,
			RTChat: this.realTimeChatService,
			OOChat: this.realTimeChatService,
		};
	}

	public async treatMessage(messagePayload: any): Promise<void> {
		await this.chatService[messagePayload.chatType].treatMessage(messagePayload);
	}
}
