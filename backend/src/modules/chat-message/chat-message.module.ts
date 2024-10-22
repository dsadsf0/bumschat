import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedLogger } from 'src/core/services/snatched-logger/logger.service';
import { RealTimeChatModule } from './modules/real-time-chat/real-time-chat.module';
import { ChatMessageService } from './chat-message.service';

@Module({
    imports: [
        RealTimeChatModule,
        // StandardChatModule, OnlyOnlineChatModule
    ],
    providers: [ChatMessageService, ConfigService, SnatchedLogger],
    exports: [ChatMessageService],
})
export class ChatMessageModule {}
