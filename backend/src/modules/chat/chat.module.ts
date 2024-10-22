import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedLogger } from 'src/core/services/snatched-logger/logger.service';
import { ChatService } from './chat.service';
import { ChatRoleModule } from '../chat-role/chat-role.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './chat.model';
import { ChatRepository } from './chat.repository';

@Module({
    imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]), ChatRoleModule],
    providers: [ChatService, ChatRepository, ConfigService, SnatchedLogger],
    exports: [ChatService],
})
export class ChatModule {}
