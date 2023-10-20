import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { SnatchedService } from 'src/modules/snatchedLogger/logger.service';

@Injectable()
export class AppService {
	constructor(private readonly logger: SnatchedService) {}

	public ping(): string {
		const loggerContext = `${AppService.name}/${this.ping.name}`;
		this.logger.info('Ping', loggerContext);

		return `Pong! ${dayjs().format('dddd, D MMMM YYYY HH:mm')}`;
	}
}
