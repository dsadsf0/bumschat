import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SnatchedService } from 'src/snatchedLogger/logger.service';
import handleError from 'src/utils/errorHandler';
import { Users } from './user.model';
import { DEFAULT_DATE_FORMAT } from 'src/consts/dateFormat';
import * as dayjs from 'dayjs';

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

	public async softDeleteUser(username: string): Promise<Users> {
		const loggerContext = `${UserRepository.name}/${this.softDeleteUser.name}`;

		try {
			const user = await this.userModel.findOneAndUpdate(
				{ username },
				{ $set: { softDeleted: dayjs().format(DEFAULT_DATE_FORMAT) } },
				{ new: true }
			).lean();

			return user;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async softRecoveryUser(username: string): Promise<Users> {
		const loggerContext = `${UserRepository.name}/${this.softRecoveryUser.name}`;

		try {
			const user = await this.userModel.findOneAndUpdate({ username }, { $set: { softDeleted: null } }, { new: true }).lean();
			
			return user;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async deleteUser(username: string): Promise<Users> {
		const loggerContext = `${UserRepository.name}/${this.deleteUser.name}`;

		try {
			const user = await this.userModel.findOneAndDelete({ username }).lean();

			return user;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}