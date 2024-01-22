import { SnatchedLogger } from 'src/core/services/snatched-logger/logger.service';
import { RealTimeChatService } from './real-time-chat.service';
import { Module } from '@nestjs/common';

@Module({
	providers: [RealTimeChatService, SnatchedLogger],
	exports: [RealTimeChatService],
})
export class RealTimeChatModule {}
