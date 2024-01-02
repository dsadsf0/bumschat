import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SnatchedService } from 'src/modules/snatched-logger/logger.service';
import handleError from 'src/core/utils/errorHandler';
import { User, UserDocument } from './user.model';
import { DEFAULT_DATE_FORMAT } from 'src/core/consts/dateFormat';
import utcDayjs from 'src/core/utils/utcDayjs';

@Injectable()
export class UserRepository {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		private readonly logger: SnatchedService
	) {}

	public async getUserByName(username: string): Promise<UserDocument | null> {
		const loggerContext = `${UserRepository.name}/${this.getUserByName.name}`;

		try {
			const user = await this.userModel.findOne({ username }).lean();

			return user || null;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async getUserByAuthToken(authToken: string): Promise<UserDocument | null> {
		const loggerContext = `${UserRepository.name}/${this.getUserByAuthToken.name}`;

		try {
			const user = await this.userModel.findOne({ authToken }).lean();

			return user || null;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async createUser(newUser: User): Promise<UserDocument> {
		const loggerContext = `${UserRepository.name}/${this.createUser.name}`;

		try {
			const user = await this.userModel.create(newUser);

			return user;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async softDeleteUser(username: string): Promise<UserDocument> {
		const loggerContext = `${UserRepository.name}/${this.softDeleteUser.name}`;

		try {
			const user = await this.userModel
				.findOneAndUpdate(
					{ username },
					{
						$set: { softDeleted: utcDayjs().format(DEFAULT_DATE_FORMAT) },
					},
					{ new: true }
				)
				.lean();

			return user;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async softRecoveryUser(username: string): Promise<UserDocument> {
		const loggerContext = `${UserRepository.name}/${this.softRecoveryUser.name}`;

		try {
			const user = await this.userModel.findOneAndUpdate({ username }, { $set: { softDeleted: null } }, { new: true }).lean();

			return user;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async deleteUser(username: string): Promise<UserDocument> {
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
