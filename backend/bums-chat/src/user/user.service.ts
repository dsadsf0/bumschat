import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigSchema } from 'src/app.schema';
import { SnatchedService } from 'src/snatchedLogger/logger.service';
import { UserCreateDto } from './dto/user-create.dto';
import handleError from './../utils/errorHandler';
import { UserRepository } from './user.repository';
import * as speakeasy from 'speakeasy';
import { QrService } from 'src/qr-service/qr.service';
import * as dayjs from 'dayjs';
import { UserCreateRdo } from './rdo/user-create.rdo';
import { Response } from 'express';
import { CryptoService } from './../crypto/crypto.service';
import { DEFAULT_DATE_FORMAT } from 'src/consts/dateFormat';
import { COOKIE_OPTIONS } from 'src/consts/cookies';

@Injectable()
export class UserService {
	constructor (
		private readonly userRepository: UserRepository,
		private readonly crypt: CryptoService,
		private readonly qrService: QrService,
		private readonly config: ConfigService<AppConfigSchema>,
		private readonly logger: SnatchedService
	) {}

	public async signUp({ username }: UserCreateDto, response: Response): Promise<UserCreateRdo> {
		const loggerContext = `${UserService.name}/${this.signUp.name}`;

		try {
			const user = await this.userRepository.getUserByName(username);
			if (user) {
				throw new HttpException('This username is taken', HttpStatus.BAD_REQUEST);
			}

			const secret = speakeasy.generateSecret({
				name: `Bums Chat: ${username}`,
			});

			const authToken = await this.crypt.uuidAndHash(username, this.config.get('AUTH_TOKEN_SALT_ROUNDS'));

			const recoveryPass = this.crypt.shortPassGen();
			const recoverySecret = await this.crypt.hash(recoveryPass, this.config.get('PASS_SALT_ROUNDS'));

			const treatedQRData = await this.qrService.otpAuthUrlToQrData(secret.otpauth_url);
			const fileName = await this.qrService.createQrImg(username, treatedQRData);

			const createdAt = dayjs().format(DEFAULT_DATE_FORMAT);

			const newUser = await this.userRepository.createUser({
				username,
				secretBase32: secret.base32,
				recoverySecret,
				createdAt,
				authToken,
				qrImg: fileName,
			});

			this.logger.info(`Registered ${username}`, loggerContext, username);

			response.cookie(`auth_token_${username}`, authToken, COOKIE_OPTIONS);

			return {
				username: newUser.username,
				qrImg: newUser.qrImg,
				recoveryPass
			};
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
