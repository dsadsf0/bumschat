import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedService } from 'src/modules/snatched-logger/logger.service';
import { ChatService } from './chat.service';
import { ChatRoleModule } from '../chat-role/chat-role.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './chat.model';

@Module({
	imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]), ChatRoleModule],
	providers: [ChatService, ConfigService, SnatchedService],
	exports: [ChatService],
})
export class ChatModule {}
