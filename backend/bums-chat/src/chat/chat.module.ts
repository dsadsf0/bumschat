import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedService } from 'src/snatchedLogger/logger.service';

@Module({
	// controllers: [ChatController],
	// providers: [ChatService, ConfigService, SnatchedService],
})
export class ChatModule {}
