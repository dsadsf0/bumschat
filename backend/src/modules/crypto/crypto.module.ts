import { ConfigService } from '@nestjs/config';
import { SnatchedLogger } from '../../core/services/snatched-logger/logger.service';
import { CryptoService } from './crypto.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [CryptoService, ConfigService, SnatchedLogger],
    exports: [CryptoService],
})
export class CryptoModule {}
