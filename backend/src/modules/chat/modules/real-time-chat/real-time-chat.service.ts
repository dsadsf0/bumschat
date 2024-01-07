import { Injectable } from '@nestjs/common';
import { AbstractChatService } from 'src/modules/chat/abstractions/chat-service';
import { SnatchedService } from 'src/modules/snatched-logger/logger.service';
import { MessageContext, MessageRdo } from '../../types/message.type';
import { Types } from 'mongoose';
import utcDayjs from 'src/core/utils/utcDayjs';

@Injectable()
export class RealTimeChatService implements AbstractChatService {
	constructor(private readonly logger: SnatchedService) {}

	public async treatMessage(messagePayload: MessageContext): Promise<MessageRdo> {
		return {
			...messagePayload,
			id: new Types.ObjectId().toString(),
			timestamp: utcDayjs().unix(),
			edited: null,
		};
	}
}
