import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigSchema } from 'src/app.schema';
import { SnatchedService } from 'src/snatchedLogger/logger.service';
import handleError from 'src/utils/errorHandler';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as util from 'util';

const generateKeyPair = util.promisify(crypto.generateKeyPair);

const PUBLIC_KEY_OPTIONS = {
	type: 'spki',
	format: 'pem',
} as const;

const PRIVATE_KEY_OPTIONS = {
	type: 'pkcs8',
	format: 'pem',
} as const;

@Injectable()
export class CryptoService {
	constructor (private readonly config: ConfigService<AppConfigSchema>, private readonly logger: SnatchedService) {}

	private getGlobalPublicKeyString(): string {
		return this.config.get('GLOBAL_PUBLIC_KEY').replace(/\\n/g, '\n');
	}

	private getGlobalPrivateString(): string {
		return this.config.get('GLOBAL_PRIVATE_KEY').replace(/\\n/g, '\n');
	}

	public getGlobalPublicKey(): crypto.KeyObject {
		return this.getPublicKey(this.getGlobalPublicKeyString());
	}

	public getGlobalPrivateKey(): crypto.KeyObject {
		return this.getPrivateKey(this.getGlobalPrivateString());
	}

	public globalEncrypt(data: string): string {
		const loggerContext = `${CryptoService.name}/${this.globalEncrypt.name}`;

		try {
			const publcKey = this.getGlobalPublicKey();
			return this.encrypt(publcKey, data);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public globalDecrypt(data: string): string {
		const loggerContext = `${CryptoService.name}/${this.globalDecrypt.name}`;

		try {
			const privateKey = this.getGlobalPrivateKey();
			return this.decrypt(privateKey, data);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async generateKeyPair(): Promise<{ publicKey: string, privateKey: string }> {
		const loggerContext = `${CryptoService.name}/${this.generateKeyPair.name}`;

		try {
			return await generateKeyPair('rsa', {
				modulusLength: 4096,
				publicKeyEncoding: PUBLIC_KEY_OPTIONS,
				privateKeyEncoding: {
					...PRIVATE_KEY_OPTIONS,
					cipher: 'aes-256-cbc',
					passphrase: this.config.get('PASS_PHRASE'),
				},
			});
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public getPublicKey(publicKeyString: string): crypto.KeyObject {
		const loggerContext = `${CryptoService.name}/${this.getPublicKey.name}`;

		try {
			return crypto.createPublicKey(publicKeyString);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public getPrivateKey(privateKeyString: string): crypto.KeyObject {
		const loggerContext = `${CryptoService.name}/${this.getPrivateKey.name}`;

		try {
			return crypto.createPrivateKey({
				key: privateKeyString,
				passphrase: this.config.get('PASS_PHRASE'),
				...PRIVATE_KEY_OPTIONS,
			});
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public encrypt(publicKey: crypto.KeyObject, data: string): string {
		const loggerContext = `${CryptoService.name}/${this.encrypt.name}`;

		try {
			return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64');
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public decrypt(privateKey: crypto.KeyObject, encryptedData: string): string {
		const loggerContext = `${CryptoService.name}/${this.decrypt.name}`;

		try {
			return crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64')).toString('utf8');
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public shortPassGen() {
		return Math.random().toString(36).slice(2, 10);
	}

	public uuidV5(content: string): string {
		const loggerContext = `${CryptoService.name}/${this.uuidV5.name}`;

		try {
			return uuid.v5(content, this.config.get('UUID_NAMESPACE'));
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async hash(content: string, saltOrRounds: string | number): Promise<string> {
		const loggerContext = `${CryptoService.name}/${this.hash.name}`;

		try {
			return await bcrypt.hash(content, saltOrRounds);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}


	public async uuidAndHash(content: string, saltOrRounds: string | number): Promise<string> {
		const loggerContext = `${CryptoService.name}/${this.uuidAndHash.name}`;

		try {
			const contentUuid = this.uuidV5(content);
			return await this.hash(contentUuid, saltOrRounds);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async validateUuidAndHash(supposedData: string, hash: string): Promise<boolean> {
		const loggerContext = `${CryptoService.name}/${this.validateUuidAndHash.name}`;

		try {
			const supposedUuid = this.uuidV5(supposedData);
			return await bcrypt.compare(supposedUuid, hash);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async validateHash(supposedData: string, hash: string): Promise<boolean> {
		const loggerContext = `${CryptoService.name}/${this.validateHash.name}`;

		try {
			return await bcrypt.compare(supposedData, hash);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}