import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SnatchedLogger } from '../../core/services/snatched-logger/logger.service';
import { Chat, ChatDocument } from './chat.model';
import { Model, Types } from 'mongoose';
import { ChatUserRights } from './types/chat-user-rights.type';
import utcDayjs from 'src/core/utils/utcDayjs';
import { DEFAULT_DATE_FORMAT } from 'src/core/consts/dateFormat';
import { ErrorHandler } from 'src/core/decorators/errorHandler.decorator';

@Injectable()
export class ChatRepository {
    constructor(
        @InjectModel(Chat.name)
        private readonly chatModel: Model<Chat>,
        private readonly logger: SnatchedLogger
    ) {}

    @ErrorHandler(ChatRepository.name)
    public async createChat(chatDto: Chat): Promise<ChatDocument> {
        return await this.chatModel.create(chatDto);
    }

    @ErrorHandler(ChatRepository.name)
    public async getChats(chatIds: string[]): Promise<ChatDocument[]> {
        const treatedChatIds = chatIds.map((id) => new Types.ObjectId(id));

        return await this.chatModel.find({ _id: { $in: treatedChatIds } });
    }

    @ErrorHandler(ChatRepository.name)
    public async editChatName(chatId: string, newName: string): Promise<ChatDocument> {
        return await this.chatModel.findByIdAndUpdate(
            chatId,
            {
                name: newName,
            },
            { new: true }
        );
    }

    @ErrorHandler(ChatRepository.name)
    public async changeUserRole(
        chatId: Types.ObjectId,
        userId: Types.ObjectId,
        roleId: Types.ObjectId
    ): Promise<ChatDocument> {
        return await this.chatModel.findByIdAndUpdate(
            chatId,
            {
                $set: { 'users.$[index].chatRole': roleId },
            },
            {
                $arrayFilters: [{ 'index.user': userId }],
                new: true,
            }
        );
    }

    @ErrorHandler(ChatRepository.name)
    public async addUsersToChat(chatId: string, newUsers: ChatUserRights[]): Promise<ChatDocument> {
        const chat = await this.chatModel.findById(chatId);

        if (!chat || chat.softDeleted) {
            throw new HttpException('Chat does not exist or deleted', HttpStatus.NOT_FOUND);
        }

        const treatedUsers = newUsers.filter(
            (newUser) => !chat.users.some((user) => newUser.user.toString() === user.user.toString())
        );

        if (!treatedUsers.length) {
            throw new HttpException('User is already chat member', HttpStatus.BAD_REQUEST);
        }

        return await this.chatModel.findByIdAndUpdate(
            chatId,
            {
                $push: { users: { $each: treatedUsers } },
            },
            { new: true }
        );
    }

    @ErrorHandler(ChatRepository.name)
    public async removeUsersFromChat(chatId: string, users: string[]): Promise<ChatDocument> {
        const treatedUserIds = users.map((id) => new Types.ObjectId(id));
        const chat = await this.chatModel.findById(chatId);

        if (!chat || chat.softDeleted) {
            throw new HttpException('Chat does not exist or deleted', HttpStatus.NOT_FOUND);
        }

        return await this.chatModel.findByIdAndUpdate(
            chatId,
            {
                $pull: { 'users.user': { $in: treatedUserIds } },
            },
            { new: true }
        );
    }

    @ErrorHandler(ChatRepository.name)
    public async softDeleteChats(chatId: string[]): Promise<void> {
        await this.chatModel.updateMany(
            { _id: { in: chatId } },
            { $set: { softDeleted: utcDayjs().format(DEFAULT_DATE_FORMAT) } }
        );
    }

    @ErrorHandler(ChatRepository.name)
    public async recoverySoftDeleteChats(chatId: string[]): Promise<void> {
        await this.chatModel.updateMany({ _id: { in: chatId } }, { $set: { softDeleted: null } });
    }

    @ErrorHandler(ChatRepository.name)
    public async deleteChatById(chatId: string): Promise<void> {
        return await this.chatModel.findByIdAndDelete(chatId).lean();
    }

    @ErrorHandler(ChatRepository.name)
    public async deleteChats(chatIds: string[]): Promise<void> {
        await this.chatModel.deleteMany({ _id: { in: chatIds } });
    }

    @ErrorHandler(ChatRepository.name)
    public async deleteAllSoftDeletedChats(): Promise<void> {
        await this.chatModel.deleteMany({ softDeleted: { $ne: null } });
    }

    @ErrorHandler(ChatRepository.name)
    public async deleteSoftDeletedChatsOlderThan(date: string): Promise<void> {
        await this.chatModel.deleteMany({ softDeleted: { $lte: date } });
    }
}
