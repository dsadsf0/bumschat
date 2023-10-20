import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigSchema } from 'src/app/app.schema';
import { SnatchedService } from 'src/modules/snatchedLogger/logger.service';
import { UserCreateDto } from './dto/user-create.dto';
import handleError from 'src/core/utils/errorHandler';
import { UserRepository } from './user.repository';
import { QrService } from 'src/modules/qr-service/qr.service';
import * as dayjs from 'dayjs';
import { UserCreateRdo } from './rdo/user-create.rdo';
import { Response } from 'express';
import { CryptoService } from './../crypto/crypto.service';
import { DEFAULT_DATE_FORMAT } from 'src/core/consts/dateFormat';
import { COOKIE_OPTIONS } from 'src/core/consts/cookies';
import { SpeakeasyService } from 'src/modules/speakeasy/speakeasy.service';
import { UserGetRdo } from './rdo/user-get.rdo';
import { Users } from './user.model';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthCheckedRequest } from './types/authCheckedTypes';
import { UserRecoveryDto } from './dto/user-recovery.dto';
import { UserCheckNameDto } from './dto/user-chek-username.dto';
import { UserRoles } from './../../core/consts/roles';

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

	private adapterUserGetRdo(user: Users): UserGetRdo {
		return { username: user.username };
	}

	private setAuthCookie(username: string, response: Response): void {
		const authToken = this.crypt.globalEncrypt(username);
		response.cookie('authToken', authToken, COOKIE_OPTIONS);
	}

	public getGlobalPublicKey(): string {
		const loggerContext = `${UserService.name}/${this.getGlobalPublicKey.name}`;

		try {
			return this.crypt.getGlobalPublicKeyString();
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

	public async getUser(username: string): Promise<UserGetRdo> {
		const loggerContext = `${UserService.name}/${this.getUser.name}`;

		try {
			const user = await this.userRepository.getUserByName(username);

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

			const publicKey = this.crypt.getPublicKey(clientPublicKey);

			const secret = this.speakeasy.generateSecret(username);
			const encryptedSecretBase32 = this.crypt.globalEncrypt(secret.base32);

			const authToken = this.crypt.globalEncrypt(username);
			const authTokenHash = await this.crypt.hash(authToken, this.config.get('AUTH_TOKEN_SALT_ROUNDS'));

			const recoverySecret = this.crypt.shortPassGen();
			const encryptedRecoverySecret = this.crypt.encrypt(publicKey, recoverySecret);
			const recoverySecretHash = await this.crypt.uuidAndHash(recoverySecret, this.config.get('PASS_SALT_ROUNDS'));

			const treatedQRData = await this.qrService.otpAuthUrlToQrData(secret.otpauth_url);
			const fileName = await this.qrService.createQrImg(username, treatedQRData);

			const createdAt = dayjs().format(DEFAULT_DATE_FORMAT);

			const newUser = await this.userRepository.createUser({
				username,
				secretBase32: encryptedSecretBase32,
				recoverySecret: recoverySecretHash,
				createdAt,
				authToken: authTokenHash,
				qrImg: fileName,
				role: UserRoles.User,
			});

			this.logger.info(`${username} registered!`, loggerContext, username);

			response.cookie('authToken', authToken, COOKIE_OPTIONS);

			return {
				username: newUser.username,
				qrImg: fileName,
				recoverySecret: encryptedRecoverySecret,
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

			return user ? true : false;
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

			const verificationCode = this.crypt.globalDecrypt(encryptedVerificationCode);
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
			this.logger.info(`${user.username} logged out!`, loggerContext, user.username);

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
			this.logger.info(`${user.username} soft DELETED!`, loggerContext, user.username);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async recoverSoftDeleted(
		{ username, recoverySecret: clientEncryptedRecoverySecret, clientPublicKey }: UserRecoveryDto,
		response: Response
	): Promise<UserCreateRdo> {
		const loggerContext = `${UserService.name}/${this.recoverSoftDeleted.name}`;

		try {
			const user = await this.userRepository.getUserByName(username);

			if (!user) {
				throw new HttpException('User with this username does not exist', HttpStatus.NOT_FOUND);
			}

			const recoverySecret = this.crypt.globalDecrypt(clientEncryptedRecoverySecret);

			const isRecoverySecretValid = await this.crypt.validateUuidAndHash(recoverySecret, this.config.get('PASS_SALT_ROUNDS'));
			if (!isRecoverySecretValid) {
				throw new HttpException('Invalid recovery secret', HttpStatus.BAD_REQUEST);
			}

			const publicKey = this.crypt.getPublicKey(clientPublicKey);
			const encryptedRecoverySecret = this.crypt.encrypt(publicKey, recoverySecret);

			const recoveredUser = await this.userRepository.softRecoveryUser(username);

			this.setAuthCookie(username, response);

			if (user.softDeleted) {
				this.logger.info(`${username} RECOVERED from soft delete!`, loggerContext, username);
			} else {
				this.logger.info(`${username} recovered access to account!`, loggerContext, username);
			}

			return {
				username: recoveredUser.username,
				qrImg: recoveredUser.qrImg,
				recoverySecret: encryptedRecoverySecret,
			};
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	// СНАЧАЛО НАДО RoleGuard СДЕЛАТЬ, ПОТОМ ПЕРЕДЕЛАТЬ ЭТУ ФУНКЦИЮ
	public async delete(request: AuthCheckedRequest, username: string): Promise<void> {
		const loggerContext = `${UserService.name}/${this.delete.name}`;

		try {
			const admin = request.user;
			if (!admin) {
				throw new HttpException('Not enough permissions, to delete user', HttpStatus.FORBIDDEN);
			}
			const user = await this.userRepository.deleteUser(username);
			await this.qrService.deleteQrImg(user.qrImg);
			this.logger.info(`${user.username} COMPLETELY DELETED by ${admin.username}!`, loggerContext, user.username);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
