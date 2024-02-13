import { ErrorHandler } from 'src/core/decorators/errorHandler.decorator';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.model';
import { DEFAULT_DATE_FORMAT } from 'src/core/consts/dateFormat';
import utcDayjs from 'src/core/utils/utcDayjs';

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) {}

    @ErrorHandler(UserRepository.name)
    public async getUserByName(username: string): Promise<UserDocument | null> {
        const user = await this.userModel.findOne({ username }).lean();

        return user || null;
    }

    @ErrorHandler(UserRepository.name)
    public async getUsersByAuthToken(authToken: string): Promise<UserDocument[]> {
        const users = await this.userModel.find({ authToken }).lean();

        return users;
    }

    @ErrorHandler(UserRepository.name)
    public async createUser(newUser: User): Promise<UserDocument> {
        const user = await this.userModel.create(newUser);

        return user;
    }

    @ErrorHandler(UserRepository.name)
    public async softDeleteUser(username: string): Promise<UserDocument> {
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
    }

    @ErrorHandler(UserRepository.name)
    public async softRecoveryUser(username: string): Promise<UserDocument> {
        const user = await this.userModel
            .findOneAndUpdate({ username }, { $set: { softDeleted: null } }, { new: true })
            .lean();

        return user;
    }

    @ErrorHandler(UserRepository.name)
    public async deleteUserByName(username: string): Promise<UserDocument> {
        const user = await this.userModel.findOneAndDelete({ username }).lean();

        return user;
    }

    @ErrorHandler(UserRepository.name)
    public async deleteUsersByIds(userIds: string[]): Promise<void> {
        await this.userModel.deleteMany({ _id: { $in: userIds } });
    }

    @ErrorHandler(UserRepository.name)
    public async deleteAllSoftDeletedUsers(): Promise<void> {
        await this.userModel.deleteMany({ softDeleted: { $ne: null } });
    }

    @ErrorHandler(UserRepository.name)
    public async deleteSoftDeletedUsersOlderThan(date: string): Promise<void> {
        await this.userModel.deleteMany({ softDeleted: { $lte: date } });
    }

    @ErrorHandler(UserRepository.name)
    public async getUserChats(userId: string): Promise<Types.ObjectId[]> {
        const user = await this.userModel.findById(userId).lean(); // TODO: добавить populated версию

        return user.chats;
    }
}
