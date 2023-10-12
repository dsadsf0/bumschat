import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedService } from 'src/snatchedLogger/logger.service';
import { QrService } from 'src/qr-service/qr.service';

@Module({
	providers: [QrService, ConfigService, SnatchedService],
	exports: [QrService],
})
export class QrModule {}
