import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { SnatchedLogger } from 'src/core/services/snatched-logger/logger.service';
import { AuthCheckedRequest } from '../types/authCheckedTypes';
import handleError from 'src/core/utils/errorHandler';
import { UserRepository } from '../user.repository';
import { Reflector } from '@nestjs/core';
import { UserRolesDecorator } from 'src/modules/user/decorators/roles.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly userRepository: UserRepository,
		private readonly logger: SnatchedLogger
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const loggerContext = `${UserRoleGuard.name}/${this.canActivate.name}`;

		try {
			const request: AuthCheckedRequest = context.switchToHttp().getRequest();

			const roles = this.reflector.get(UserRolesDecorator, context.getHandler());
			if (!roles) {
				return true;
			}

			const user = request.user;

			if (!user) {
				throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
			}

			const admin = await this.userRepository.getUserByName(user.username);

			if (!roles.includes(admin.role)) {
				this.logger.error(`${admin.username} do not enough permissions`, loggerContext, admin.username);
				throw new HttpException('Not enough permissions', HttpStatus.FORBIDDEN);
			}

			return true;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
