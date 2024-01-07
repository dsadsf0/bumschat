import utcDayjs from 'src/core/utils/utcDayjs';
import { MessageContext, MessageRdo } from '../types/message.type';
import { Types } from 'mongoose';

export abstract class AbstractChatService {
	public async treatMessage(messagePayload: MessageContext): Promise<MessageRdo> {
		return {
			...messagePayload,
			id: new Types.ObjectId().toString(),
			timestamp: utcDayjs().unix(),
			edited: null,
		};
	}
}
