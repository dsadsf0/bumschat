import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { SnatchedLogger } from 'src/core/services/snatched-logger/logger.service';
import { AuthCheckedRequest } from '../types/authCheckedTypes';
import handleError from 'src/core/utils/errorHandler';
import { UserRepository } from '../user.repository';
import { CryptoService } from 'src/modules/crypto/crypto.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly crypt: CryptoService,
        private readonly logger: SnatchedLogger
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const loggerContext = `${AuthGuard.name}/${this.canActivate.name}`;

        try {
            const request: AuthCheckedRequest = context.switchToHttp().getRequest();

            const { authToken } = request.cookies || { authToken: null };
            if (!authToken) {
                throw new HttpException('Unauthorized. No auth token.', HttpStatus.UNAUTHORIZED);
            }

            let username = '';

            try {
                username = this.crypt.globalDecryptPrivate(authToken);
            } catch (error) {
                throw new HttpException('Unauthorized. Invalid token.', HttpStatus.UNAUTHORIZED);
            }

            const user = await this.userRepository.getUserByName(username);

            if (!user || user.softDeleted) {
                throw new HttpException('Unauthorized. Invalid token.', HttpStatus.UNAUTHORIZED);
            }

            const isValidAuthToken = await this.crypt.validateUuidAndHash(authToken, user.authToken);
            if (!isValidAuthToken) {
                throw new HttpException('Unauthorized. Invalid token.', HttpStatus.UNAUTHORIZED);
            }

            request.user = {
                username: user.username,
                id: user._id.toString(),
                chats: user.chats.map(String),
            };

            return true;
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }
}
