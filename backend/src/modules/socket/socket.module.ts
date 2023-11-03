import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedService } from '../snatchedLogger/logger.service';
import { SocketGateway } from './socket.gateway';
import { UserModule } from 'src/modules/user/user.module';
import { CryptoModule } from '../crypto/crypto.module';
import { SocketService } from './socket.service';

@Module({
	imports: [UserModule, CryptoModule],
	providers: [SocketGateway, SocketService, ConfigService, SnatchedService],
})
export class SocketModule {}
