import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedService } from 'src/modules/snatched-logger/logger.service';
import { ChatService } from './chat.service';
import { ChatRoleModule } from '../chat-role/chat-role.module';

@Module({
	imports: [ChatRoleModule],
	providers: [ChatService, ConfigService, SnatchedService],
	exports: [ChatService],
})
export class ChatModule {}
