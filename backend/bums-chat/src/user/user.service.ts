import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigSchema } from 'src/app.schema';
import { SnatchedService } from 'src/snatchedLogger/logger.service';
import { UserCreateDto } from './dto/user-create.dto';
import handleError from './../utils/errorHandler';
import { UserRepository } from './user.repository';
import { QrService } from 'src/qr-service/qr.service';
import * as dayjs from 'dayjs';
import { UserCreateRdo } from './rdo/user-create.rdo';
import { Response, Request } from 'express';
import { CryptoService } from './../crypto/crypto.service';
import { DEFAULT_DATE_FORMAT } from 'src/consts/dateFormat';
import { COOKIE_OPTIONS } from 'src/consts/cookies';
import { SpeakeasyService } from 'src/speakeasy/speakeasy.service';
import { UserGetRdo } from './rdo/user-get.rdo';
import { Users } from './user.model';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthCheckedRequest } from './types/authCheckedTypes';

@Injectable()
export class UserService {
	constructor (
		private readonly userRepository: UserRepository,
		private readonly crypt: CryptoService,
		private readonly qrService: QrService,
		private readonly speakeasy: SpeakeasyService,
		private readonly config: ConfigService<AppConfigSchema>,
		private readonly logger: SnatchedService
	) {}

	private adapterUserGetRdo(user: Users): UserGetRdo {
		return { username: user.username };
	}

	// ВЫНЕСТИ В ДЕКОРАТОР
	public async authCheck(req: Request) {
		const loggerContext = `${UserService.name}/${this.authCheck.name}`;

		try {
			const[ { authToken, username }] = Object.values(req.cookies)
				.filter((value) => value[0].includes('auth_token_'))
				.map((value) => ({ authToken: value[1], username: value[0].split('_')[1] }));
			if (!authToken) {
				throw new HttpException('Unauthorized. No auth token', HttpStatus.UNAUTHORIZED);
			}

			const user = await this.userRepository.getUserByName(username);

			if (!user || await this.crypt.validateHash(authToken, user.authToken)) {
				throw new HttpException('Unauthorized. Invalid token', HttpStatus.UNAUTHORIZED);
			}
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async signUp({ username }: UserCreateDto, response: Response): Promise<UserCreateRdo> {
		const loggerContext = `${UserService.name}/${this.signUp.name}`;

		try {
			const user = await this.userRepository.getUserByName(username);
			if (user) {
				throw new HttpException('This username is taken', HttpStatus.BAD_REQUEST);
			}

			const secret = this.speakeasy.generateSecret(username);

			const authToken = this.crypt.uuidV5(username);
			const authTokenHash = await this.crypt.hash(authToken, this.config.get('AUTH_TOKEN_SALT_ROUNDS'));

			const recoverySecret = this.crypt.shortPassGen();
			const recoverySecretHash = await this.crypt.uuidAndHash(recoverySecret, this.config.get('PASS_SALT_ROUNDS'));

			const treatedQRData = await this.qrService.otpAuthUrlToQrData(secret.otpauth_url);
			const fileName = await this.qrService.createQrImg(username, treatedQRData);

			const createdAt = dayjs().format(DEFAULT_DATE_FORMAT);

			const newUser = await this.userRepository.createUser({
				username,
				secretBase32: secret.base32,
				recoverySecret: recoverySecretHash,
				createdAt,
				authToken: authTokenHash,
				qrImg: fileName,
			});

			this.logger.info(`${username} registered!`, loggerContext, username);

			response.cookie(`auth_token_${username}`, authToken, COOKIE_OPTIONS);

			return {
				username: newUser.username,
				qrImg: newUser.qrImg,
				recoverySecret
			};
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async checkUsername({ username }: UserCreateDto): Promise<boolean> {
		const loggerContext = `${UserService.name}/${this.checkUsername.name}`;

		try {
			const user = await this.userRepository.getUserByName(username);

			return user ? true : false;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async login({ username, verificationCode }: UserLoginDto, response: Response): Promise<UserGetRdo> {
		const loggerContext = `${UserService.name}/${this.login.name}`;

		try {
			const user = await this.userRepository.getUserByName(username);

			if (!user) {
				throw new HttpException('This user does not exist', HttpStatus.NOT_FOUND);
			}

			if (!this.speakeasy.validateCode(user.secretBase32, verificationCode)) {
				throw new HttpException('Doesn\'t correct 2FA code', HttpStatus.UNAUTHORIZED);
			}

			this.logger.info(`${username} logged in!`, loggerContext, username);

			response.cookie(`auth_token_${username}`, user.authToken, COOKIE_OPTIONS);

			return this.adapterUserGetRdo(user);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async logout(req: AuthCheckedRequest, response: Response): Promise<void> {
		const loggerContext = `${UserService.name}/${this.logout.name}`;

		try {
			response.clearCookie(`auth_token_${req.user.username}`, COOKIE_OPTIONS);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
