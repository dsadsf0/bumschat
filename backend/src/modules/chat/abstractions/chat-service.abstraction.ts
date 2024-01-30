import utcDayjs from 'src/core/utils/utcDayjs';
import { Types } from 'mongoose';
import { MessageContext, MessageRdo } from 'src/modules/chat-message/types/message.type';

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
