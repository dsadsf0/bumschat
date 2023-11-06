import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { SnatchedService } from 'src/modules/snatchedLogger/logger.service';
import { AuthCheckedRequest } from '../types/authCheckedTypes';
import handleError from 'src/core/utils/errorHandler';
import { UserRepository } from '../user.repository';
import { CryptoService } from 'src/modules/crypto/crypto.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly crypt: CryptoService,
		private readonly logger: SnatchedService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const loggerContext = `${AuthGuard.name}/${this.canActivate.name}`;

		try {
			const request: AuthCheckedRequest = context.switchToHttp().getRequest();

			const { authToken } = request.cookies ? request.cookies : { authToken: null };
			if (!authToken) {
				throw new HttpException('Unauthorized. No auth token.', HttpStatus.UNAUTHORIZED);
			}

			const username = this.crypt.globalDecrypt(authToken);
			const user = await this.userRepository.getUserByName(username);

			if (!user) {
				throw new HttpException('Unauthorized. Invalid token.', HttpStatus.UNAUTHORIZED);
			}

			const isValidAuthToken = await this.crypt.validateUuidAndHash(authToken, user.authToken);
			if (!user || !isValidAuthToken) {
				throw new HttpException('Unauthorized. Invalid token.', HttpStatus.UNAUTHORIZED);
			}

			request.user = {
				username: user.username,
			};

			return true;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
