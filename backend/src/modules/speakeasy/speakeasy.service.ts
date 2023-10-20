import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import { SnatchedService } from 'src/modules/snatchedLogger/logger.service';
import handleError from 'src/core/utils/errorHandler';

@Injectable()
export class SpeakeasyService {
	constructor(private readonly logger: SnatchedService) {}

	public generateSecret(username: string): speakeasy.GeneratedSecret {
		const loggerContext = `${SpeakeasyService.name}/${this.generateSecret.name}`;
		try {
			return speakeasy.generateSecret({
				name: `Bums Chat: ${username}`,
			});
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public validateCode(userSecret: string, code: string): boolean {
		const loggerContext = `${SpeakeasyService.name}/${this.generateSecret.name}`;
		try {
			return speakeasy.totp.verify({
				secret: userSecret,
				encoding: 'base32',
				token: code,
			});
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
