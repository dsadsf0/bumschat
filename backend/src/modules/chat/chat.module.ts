import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedService } from 'src/modules/snatchedLogger/logger.service';

@Module({
	// controllers: [ChatController],
	// providers: [ChatService, ConfigService, SnatchedService],
})
export class ChatModule {}
