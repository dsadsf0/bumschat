import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedService } from 'src/modules/snatched-logger/logger.service';
import { ChatService } from './chat.service';

@Module({
	providers: [ChatService, ConfigService, SnatchedService],
	exports: [ChatService],
})
export class ChatModule {}
