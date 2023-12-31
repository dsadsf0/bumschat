import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedService } from 'src/modules/snatchedLogger/logger.service';
import { ChatService } from './chat.service';

@Module({
	// imports: [StandardChatModule, RealTimeChatModule, OnlyOnlineChatModule],
	providers: [ChatService, ConfigService, SnatchedService],
})
export class ChatModule {}
