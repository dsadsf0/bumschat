import { Injectable } from '@nestjs/common';
import { AbstractChatMessageService } from '../../abstractions/chat-service';
import { SnatchedLogger } from 'src/core/services/snatched-logger/logger.service';
import { MessageContext, MessageRdo } from '../../types/message.type';
import { Types } from 'mongoose';
import utcDayjs from 'src/core/utils/utcDayjs';
import handleError from 'src/core/utils/errorHandler';

@Injectable()
export class RealTimeChatService implements AbstractChatMessageService {
    constructor(private readonly logger: SnatchedLogger) {}

    public async treatMessage(messagePayload: MessageContext): Promise<MessageRdo> {
        const loggerContext = `${RealTimeChatService.name}/${this.treatMessage.name}`;

        try {
            const treatedMessage = {
                ...messagePayload,
                id: new Types.ObjectId().toString(),
                timestamp: utcDayjs().unix(),
                edited: null,
            };

            this.logger.trace(loggerContext, 'Treated message', treatedMessage);

            return treatedMessage;
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }
}
