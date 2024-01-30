import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SnatchedLogger } from 'src/core/services/snatched-logger/logger.service';
import handleError from 'src/core/utils/errorHandler';
import { User, UserDocument } from './user.model';
import { DEFAULT_DATE_FORMAT } from 'src/core/consts/dateFormat';
import utcDayjs from 'src/core/utils/utcDayjs';

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private readonly logger: SnatchedLogger
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

    public async getUsersByAuthToken(authToken: string): Promise<UserDocument[]> {
        const loggerContext = `${UserRepository.name}/${this.getUsersByAuthToken.name}`;

        try {
            const users = await this.userModel.find({ authToken }).lean();

            return users;
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
            const user = await this.userModel
                .findOneAndUpdate({ username }, { $set: { softDeleted: null } }, { new: true })
                .lean();

            return user;
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public async deleteUserByName(username: string): Promise<UserDocument> {
        const loggerContext = `${UserRepository.name}/${this.deleteUserByName.name}`;

        try {
            const user = await this.userModel.findOneAndDelete({ username }).lean();

            return user;
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public async deleteUsersByIds(userIds: string[]): Promise<void> {
        const loggerContext = `${UserRepository.name}/${this.deleteUsersByIds.name}`;

        try {
            await this.userModel.deleteMany({ _id: { $in: userIds } });
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public async deleteAllSoftDeletedUsers(): Promise<void> {
        const loggerContext = `${UserRepository.name}/${this.deleteAllSoftDeletedUsers.name}`;

        try {
            await this.userModel.deleteMany({ softDeleted: { $ne: null } });
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public async deleteSoftDeletedUsersOlderThan(date: string): Promise<void> {
        const loggerContext = `${UserRepository.name}/${this.deleteSoftDeletedUsersOlderThan.name}`;

        try {
            await this.userModel.deleteMany({ softDeleted: { $lte: date } });
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public async getUserChats(userId: string): Promise<Types.ObjectId[]> {
        const loggerContext = `${UserRepository.name}/${this.getUserChats.name}`;
        try {
            const user = await this.userModel.findById(userId).lean(); // TODO: добавить populated версию

            return user.chats;
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }
}
