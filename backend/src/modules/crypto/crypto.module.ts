import { ConfigService } from '@nestjs/config';
import { SnatchedService } from '../snatched-logger/logger.service';
import { CryptoService } from './crypto.service';
import { Module } from '@nestjs/common';

@Module({
	providers: [CryptoService, ConfigService, SnatchedService],
	exports: [CryptoService],
})
export class CryptoModule {}
