import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigSchema } from 'src/app.schema';
import { SnatchedService } from 'src/snatchedLogger/logger.service';
import handleError from 'src/utils/errorHandler';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
	constructor (private readonly config: ConfigService<AppConfigSchema>, private readonly logger: SnatchedService) {}

	public shortPassGen() {
		return Math.random().toString(36).slice(2, 10);
	}

	public async uuidV5(content: string): Promise<string> {
		const loggerContext = `${CryptoService.name}/${this.uuidV5.name}`;

		try {
			return uuid.v5(content, this.config.get('UUID_NAMESPACE'));
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async hash(content: string, saltOrRounds: string | number): Promise<string> {
		const loggerContext = `${CryptoService.name}/${this.uuidV5.name}`;

		try {
			return await bcrypt.hash(content, saltOrRounds);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async uuidAndHash(content: string, saltOrRounds: string | number): Promise<string> {
		const loggerContext = `${CryptoService.name}/${this.uuidV5.name}`;

		try {
			const contentUuid = await this.uuidV5(content);
			return await this.hash(contentUuid, saltOrRounds);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}