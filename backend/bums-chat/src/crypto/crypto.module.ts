import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedService } from 'src/snatchedLogger/logger.service';
import { CryptoService } from './crypto.service';

@Module({
	providers: [CryptoService, ConfigService, SnatchedService],
	exports: [CryptoService],
})
export class CryptoModule {}
