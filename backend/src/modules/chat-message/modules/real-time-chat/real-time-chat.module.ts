import { SnatchedService } from 'src/modules/snatched-logger/logger.service';
import { RealTimeChatService } from './real-time-chat.service';
import { Module } from '@nestjs/common';

@Module({
	providers: [RealTimeChatService, SnatchedService],
	exports: [RealTimeChatService],
})
export class RealTimeChatModule {}
