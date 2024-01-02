import { Injectable } from '@nestjs/common';
import utcDayjs from 'src/core/utils/utcDayjs';
import { SnatchedService } from 'src/modules/snatched-logger/logger.service';

@Injectable()
export class AppService {
	constructor(private readonly logger: SnatchedService) {}

	public ping(): string {
		const loggerContext = `${AppService.name}/${this.ping.name}`;
		this.logger.info('Ping', loggerContext);

		return `Pong! ${utcDayjs().format('dddd, D MMMM YYYY HH:mm')}`;
	}
}
