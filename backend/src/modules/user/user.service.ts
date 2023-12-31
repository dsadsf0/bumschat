import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigSchema } from 'src/app/app.schema';
import { SnatchedService } from 'src/modules/snatchedLogger/logger.service';
import { UserCreateDto } from './dto/create-user.dto';
import handleError from 'src/core/utils/errorHandler';
import { UserRepository } from './user.repository';
import { QrService } from 'src/modules/qr-service/qr.service';
import { UserCreateRdo } from './rdo/create-user.rdo';
import { Response } from 'express';
import { CryptoService } from 'src/modules/crypto/crypto.service';
import { DEFAULT_DATE_FORMAT } from 'src/core/consts/dateFormat';
import { COOKIE_OPTIONS } from 'src/core/consts/cookies';
import { SpeakeasyService } from 'src/modules/speakeasy/speakeasy.service';
import { UserGetRdo } from './rdo/get-user.rdo';
import { User } from './user.model';
import { UserLoginDto } from './dto/login-user.dto';
import { AuthCheckedRequest } from './types/authCheckedTypes';
import { UserRecoveryDto } from './dto/recovery-user.dto';
import { UserCheckNameDto } from './dto/check-username.dto';
import { UserRoles } from 'src/core/consts/roles';
import utcDayjs from 'src/core/utils/utcDayjs';

@Injectable()
export class UserService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly crypt: CryptoService,
		private readonly qrService: QrService,
		private readonly speakeasy: SpeakeasyService,
		private readonly config: ConfigService<AppConfigSchema>,
		private readonly logger: SnatchedService
	) {}

	private adapterUserGetRdo(user: User): UserGetRdo {
		return { username: user.username };
	}

	private setAuthCookie(username: string, response: Response): void {
		const authToken = this.crypt.globalEncryptPrivate(username);
		response.cookie('authToken', authToken, COOKIE_OPTIONS);
	}

	public getPublicKey(): string {
		const loggerContext = `${UserService.name}/${this.getPublicKey.name}`;

		try {
			return this.crypt.getPublicKey();
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async getQrImg(username: string): Promise<string> {
		const loggerContext = `${UserService.name}/${this.getQrImg.name}`;

		try {
			const user = await this.userRepository.getUserByName(username);

			if (!user) {
				throw new HttpException('User with this username does not exist', HttpStatus.NOT_FOUND);
			}

			return user.qrImg;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async getUserByToken(token: string): Promise<UserGetRdo> {
		const loggerContext = `${UserService.name}/${this.getUserByToken.name}`;

		try {
			const user = await this.userRepository.getUserByAuthToken(token);

			if (!user || user.softDeleted) {
				throw new HttpException('User with this username does not exist or deleted', HttpStatus.NOT_FOUND);
			}

			return this.adapterUserGetRdo(user);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async signUp({ username, clientPublicKey }: UserCreateDto, response: Response): Promise<UserCreateRdo> {
		const loggerContext = `${UserService.name}/${this.signUp.name}`;

		try {
			const user = await this.userRepository.getUserByName(username);
			if (user) {
				throw new HttpException('This username is taken', HttpStatus.BAD_REQUEST);
			}

			const secret = this.speakeasy.generateSecret(username);
			const encryptedSecretBase32 = this.crypt.globalEncrypt(secret.base32);

			const authToken = this.crypt.globalEncryptPrivate(username);
			const authTokenHash = await this.crypt.uuidAndHash(authToken, this.config.get('AUTH_TOKEN_SALT_ROUNDS'));

			const recoverySecret = this.crypt.shortPassGen();
			const recoverySecretClientEncrypted = this.crypt.encrypt(recoverySecret, clientPublicKey);
			const recoverySecretHash = await this.crypt.uuidAndHash(recoverySecret, this.config.get('PASS_SALT_ROUNDS'));

			const treatedQRData = await this.qrService.otpAuthUrlToQrData(secret.otpauth_url);
			const fileName = await this.qrService.createQrImg(username, treatedQRData);

			const createdAt = utcDayjs().format(DEFAULT_DATE_FORMAT);

			const newUser = await this.userRepository.createUser({
				username,
				secretBase32: encryptedSecretBase32,
				recoverySecret: recoverySecretHash,
				createdAt,
				authToken: authTokenHash,
				qrImg: fileName,
				role: UserRoles.User,
				softDeleted: null,
			});

			this.logger.info(`Registered new user ${username}!`, loggerContext, username);

			response.cookie('authToken', authToken, COOKIE_OPTIONS);

			return {
				user: this.adapterUserGetRdo(newUser),
				recoverySecret: recoverySecretClientEncrypted,
			};
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async checkUsername({ username }: UserCheckNameDto): Promise<boolean> {
		const loggerContext = `${UserService.name}/${this.checkUsername.name}`;

		try {
			const user = await this.userRepository.getUserByName(username);

			return !!user;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async login({ username, verificationCode: encryptedVerificationCode }: UserLoginDto, response: Response): Promise<UserGetRdo> {
		const loggerContext = `${UserService.name}/${this.login.name}`;

		try {
			const user = await this.userRepository.getUserByName(username);

			if (!user || user.softDeleted) {
				throw new HttpException('This user does not exist or deleted', HttpStatus.NOT_FOUND);
			}

			const secretBase32 = this.crypt.globalDecrypt(user.secretBase32);

			const verificationCode = this.crypt.decrypt(encryptedVerificationCode);
			const isVerificationCodeValid = this.speakeasy.validateCode(secretBase32, verificationCode);
			if (!isVerificationCodeValid) {
				throw new HttpException('Does not correct 2FA code', HttpStatus.UNAUTHORIZED);
			}

			this.logger.info(`${username} logged in!`, loggerContext, username);

			this.setAuthCookie(username, response);

			return this.adapterUserGetRdo(user);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async logout(request: AuthCheckedRequest, response: Response): Promise<void> {
		const loggerContext = `${UserService.name}/${this.logout.name}`;

		try {
			const user = request.user;
			this.logger.info(`Logged out ${user.username}!`, loggerContext, user.username);

			response.clearCookie('authToken', COOKIE_OPTIONS);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async softDelete(request: AuthCheckedRequest, response: Response): Promise<void> {
		const loggerContext = `${UserService.name}/${this.softDelete.name}`;

		try {
			const user = await this.userRepository.softDeleteUser(request.user.username);

			await this.logout(request, response);
			this.logger.info(`Soft DELETED ${user.username}!`, loggerContext, user.username);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async recoverSoftDeleted({ username, recoverySecret: clientEncryptedRecoverySecret }: UserRecoveryDto, response: Response): Promise<UserGetRdo> {
		const loggerContext = `${UserService.name}/${this.recoverSoftDeleted.name}`;

		try {
			const user = await this.userRepository.getUserByName(username);

			if (!user) {
				throw new HttpException('User with this username does not exist', HttpStatus.NOT_FOUND);
			}

			const recoverySecret = this.crypt.decrypt(clientEncryptedRecoverySecret);

			const isRecoverySecretValid = await this.crypt.validateUuidAndHash(recoverySecret, this.config.get('PASS_SALT_ROUNDS'));
			if (!isRecoverySecretValid) {
				throw new HttpException('Invalid recovery secret', HttpStatus.BAD_REQUEST);
			}

			const recoveredUser = await this.userRepository.softRecoveryUser(username);

			this.setAuthCookie(username, response);

			if (user.softDeleted) {
				this.logger.info(`RECOVERED ${username} from soft delete!`, loggerContext, username);
			} else {
				this.logger.info(`Recovered ${username} access to account!`, loggerContext, username);
			}

			return this.adapterUserGetRdo(recoveredUser);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async delete(request: AuthCheckedRequest, username: string): Promise<void> {
		const loggerContext = `${UserService.name}/${this.delete.name}`;

		try {
			const admin = request.user;
			if (!admin) {
				throw new HttpException('Not enough permissions, to delete user', HttpStatus.FORBIDDEN);
			}
			const user = await this.userRepository.deleteUser(username);
			await this.qrService.deleteQrImg(user.qrImg);
			this.logger.info(`COMPLETELY DELETED user ${user.username} by ${admin.username}!`, loggerContext, user.username);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async getAuthToken(request: AuthCheckedRequest, publicKey: string): Promise<string> {
		const loggerContext = `${UserService.name}/${this.delete.name}`;

		try {
			const user = request.user;

			if (!user) {
				throw new HttpException('Not enough permissions, to delete user', HttpStatus.FORBIDDEN);
			}

			const { authToken } = await this.userRepository.getUserByName(user.username);

			const encryptedToken = this.crypt.encrypt(authToken, publicKey);

			return encryptedToken;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
