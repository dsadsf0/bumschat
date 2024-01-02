import { Injectable } from '@nestjs/common';
import { AbstractChatService } from 'src/modules/chat/abstractions/chat-service';
import { SnatchedService } from 'src/modules/snatched-logger/logger.service';

@Injectable()
export class RealTimeChatService implements AbstractChatService {
	constructor(private readonly logger: SnatchedService) {}

	public async treatMessage(messagePayload: any): Promise<any> {}
}
