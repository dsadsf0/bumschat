import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedLogger } from '../../core/services/snatched-logger/logger.service';
import { SocketGateway } from './socket.gateway';
import { UserModule } from 'src/modules/user/user.module';
import { CryptoModule } from '../crypto/crypto.module';
import { SocketService } from './socket.service';
import { ChatMessageModule } from '../chat-message/chat-message.module';

@Module({
    imports: [UserModule, CryptoModule, ChatMessageModule],
    providers: [SocketGateway, SocketService, ConfigService, SnatchedLogger],
})
export class SocketModule {}
