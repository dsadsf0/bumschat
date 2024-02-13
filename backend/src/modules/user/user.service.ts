import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigSchema } from 'src/app/app.schema';
import { SnatchedLogger } from 'src/core/services/snatched-logger/logger.service';
import { UserCreateDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { QrService } from 'src/core/services/qr-service/qr.service';
import { UserCreateRdo } from './rdo/create-user.rdo';
import { Response } from 'express';
import { CryptoService } from 'src/modules/crypto/crypto.service';
import { COOKIE_OPTIONS } from 'src/core/consts/cookies';
import { SpeakeasyService } from 'src/core/services/speakeasy/speakeasy.service';
import { UserGetRdo } from './rdo/get-user.rdo';
import { UserDocument } from './user.model';
import { UserLoginDto } from './dto/login-user.dto';
import { AuthCheckedRequest } from './types/authCheckedTypes';
import { UserRecoveryDto } from './dto/recovery-user.dto';
import { UserCheckNameDto } from './dto/check-username.dto';
import { AvatarService, AvatarTo } from 'src/core/services/avatar-service/avatar.service';
import { ErrorHandler } from 'src/core/decorators/errorHandler.decorator';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly crypt: CryptoService,
        private readonly qrService: QrService,
        private readonly speakeasy: SpeakeasyService,
        private readonly avatarService: AvatarService,
        private readonly config: ConfigService<AppConfigSchema>,
        private readonly logger: SnatchedLogger
    ) {}

    private adapterUserGetRdo(user: UserDocument): UserGetRdo {
        return { username: user.username, id: user._id.toString(), chats: user.chats.map(String) };
    }

    private setAuthCookie(username: string, response: Response): void {
        const authToken = this.crypt.globalEncryptPrivate(username);
        response.cookie('authToken', authToken, COOKIE_OPTIONS);
    }

    @ErrorHandler(UserService.name)
    public getPublicKey(): string {
        return this.crypt.getPublicKey();
    }

    @ErrorHandler(UserService.name)
    public async getQrImg(username: string): Promise<string> {
        const user = await this.userRepository.getUserByName(username);

        if (!user) {
            throw new HttpException('User with this username does not exist', HttpStatus.NOT_FOUND);
        }

        return user.qrImg;
    }

    @ErrorHandler(UserService.name)
    public async getUsersByToken(token: string): Promise<UserGetRdo[]> {
        const users = await this.userRepository.getUsersByAuthToken(token);

        return users.map((user) => this.adapterUserGetRdo(user));
    }

    @ErrorHandler(UserService.name)
    public async signUp({ username, clientPublicKey }: UserCreateDto, response: Response): Promise<UserCreateRdo> {
        const loggerContext = `${UserService.name}/${this.signUp.name}`;

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
        const qrImgFileName = await this.qrService.createQrImg(treatedQRData, username);

        const avatarFileName = await this.avatarService.createAvatar(AvatarTo.User);

        const newUser = await this.userRepository.createUser({
            username,
            avatar: avatarFileName,
            secretBase32: encryptedSecretBase32,
            recoverySecret: recoverySecretHash,
            authToken: authTokenHash,
            qrImg: qrImgFileName,
            chats: [],
        });

        this.logger.info(`Registered new user ${username}!`, loggerContext, {
            logEntityId: newUser._id.toString(),
            tagInMessage: username,
        });

        response.cookie('authToken', authToken, COOKIE_OPTIONS);

        return {
            user: this.adapterUserGetRdo(newUser),
            recoverySecret: recoverySecretClientEncrypted,
        };
    }

    @ErrorHandler(UserService.name)
    public async checkUsername({ username }: UserCheckNameDto): Promise<boolean> {
        const user = await this.userRepository.getUserByName(username);

        if (!user) {
            throw new HttpException('User with this username does not exist', HttpStatus.BAD_REQUEST);
        }

        return true;
    }

    @ErrorHandler(UserService.name)
    public async login(
        { username, verificationCode: encryptedVerificationCode }: UserLoginDto,
        response: Response
    ): Promise<UserGetRdo> {
        const loggerContext = `${UserService.name}/${this.login.name}`;

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

        this.logger.info(`${username} logged in!`, loggerContext, {
            logEntityId: user._id.toString(),
            tagInMessage: username,
        });

        this.setAuthCookie(username, response);

        return this.adapterUserGetRdo(user);
    }

    @ErrorHandler(UserService.name)
    public async logout(request: AuthCheckedRequest, response: Response): Promise<void> {
        const loggerContext = `${UserService.name}/${this.logout.name}`;

        const user = request.user;
        this.logger.info(`Logged out ${user.username}!`, loggerContext, {
            logEntityId: user.id.toString(),
            tagInMessage: user.username,
        });

        response.clearCookie('authToken', COOKIE_OPTIONS);
    }

    @ErrorHandler(UserService.name)
    public async softDelete(request: AuthCheckedRequest, response: Response): Promise<void> {
        const loggerContext = `${UserService.name}/${this.softDelete.name}`;

        const user = await this.userRepository.softDeleteUser(request.user.username);

        await this.logout(request, response);
        this.logger.info(`Soft DELETED ${user.username}!`, loggerContext, {
            logEntityId: user._id.toString(),
            tagInMessage: user.username,
        });
    }

    @ErrorHandler(UserService.name)
    public async recoverSoftDeleted(
        { username, recoverySecret: clientEncryptedRecoverySecret }: UserRecoveryDto,
        response: Response
    ): Promise<UserGetRdo> {
        const loggerContext = `${UserService.name}/${this.recoverSoftDeleted.name}`;

        const user = await this.userRepository.getUserByName(username);

        if (!user) {
            throw new HttpException('User with this username does not exist', HttpStatus.NOT_FOUND);
        }

        const recoverySecret = this.crypt.decrypt(clientEncryptedRecoverySecret);

        const isRecoverySecretValid = await this.crypt.validateUuidAndHash(
            recoverySecret,
            this.config.get('PASS_SALT_ROUNDS')
        );
        if (!isRecoverySecretValid) {
            throw new HttpException('Invalid recovery secret', HttpStatus.BAD_REQUEST);
        }

        const recoveredUser = await this.userRepository.softRecoveryUser(username);

        this.setAuthCookie(username, response);

        if (user.softDeleted) {
            this.logger.info(`RECOVERED ${username} from soft delete!`, loggerContext, {
                logEntityId: user._id.toString(),
                tagInMessage: user.username,
            });
        } else {
            this.logger.info(`Recovered ${username} access to account!`, loggerContext, {
                logEntityId: user._id.toString(),
                tagInMessage: user.username,
            });
        }

        return this.adapterUserGetRdo(recoveredUser);
    }

    @ErrorHandler(UserService.name)
    public async delete(request: AuthCheckedRequest, username: string): Promise<void> {
        const loggerContext = `${UserService.name}/${this.delete.name}`;

        const admin = request.user;
        if (!admin) {
            throw new HttpException('Not enough permissions, to delete user', HttpStatus.FORBIDDEN);
        }
        const user = await this.userRepository.deleteUserByName(username);

        if (!user) {
            throw new HttpException('User does not exist or already deleted', HttpStatus.NOT_FOUND);
        }

        await this.qrService.deleteQrImg(user.qrImg, user.username, user._id.toString());
        this.logger.info(`COMPLETELY DELETED user ${user.username} by ${admin.username}!`, loggerContext, {
            logEntityId: user._id.toString(),
            tagInMessage: user.username,
        });
    }

    @ErrorHandler(UserService.name)
    public async getAuthToken(request: AuthCheckedRequest, publicKey: string): Promise<string> {
        const user = request.user;

        if (!user) {
            throw new HttpException('Not enough permissions, to delete user', HttpStatus.FORBIDDEN);
        }

        const { authToken } = await this.userRepository.getUserByName(user.username);

        const encryptedToken = this.crypt.encrypt(authToken, publicKey);

        return encryptedToken;
    }
}
