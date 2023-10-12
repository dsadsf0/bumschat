import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SnatchedService } from 'src/snatchedLogger/logger.service';
import handleError from 'src/utils/errorHandler';
import { Users } from './user.model';

@Injectable()
export class UserRepository {
	constructor(
        @InjectModel(Users.name)
        private readonly userModel: Model<Users>,
        private readonly logger: SnatchedService,
	) {}

	public async getUserByName(username: string): Promise<Users | null> {
		const loggerContext = `${UserRepository.name}/${this.getUserByName.name}`;

		try {
			const user = await this.userModel.findOne({ username }).lean();

			return user || null;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async getUserByAuthToken(authToken: string): Promise<Users | null> {
		const loggerContext = `${UserRepository.name}/${this.getUserByAuthToken.name}`;

		try {
			const user = await this.userModel.findOne({ authToken }).lean();

			return user || null;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async createUser(newUser: Users): Promise<Users> {
		const loggerContext = `${UserRepository.name}/${this.createUser.name}`;

		try {
			const user = await this.userModel.create(newUser);

			return user;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}