import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SnatchedLogger } from '../../core/services/snatched-logger/logger.service';
import { Chat, ChatDocument } from './chat.model';
import { Model, Types } from 'mongoose';
import handleError from 'src/core/utils/errorHandler';
import { ChatUserRights } from './types/chat-user-rights.type';
import utcDayjs from 'src/core/utils/utcDayjs';
import { DEFAULT_DATE_FORMAT } from 'src/core/consts/dateFormat';

@Injectable()
export class ChatRepository {
	constructor(
		@InjectModel(Chat.name)
		private readonly chatModel: Model<Chat>,
		private readonly logger: SnatchedLogger
	) {}

	public async createChat(chatDto: Chat): Promise<ChatDocument> {
		const loggerContext = `${ChatRepository.name}/${this.createChat.name}`;

		try {
			return await this.chatModel.create(chatDto);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async getChats(chatIds: string[]): Promise<ChatDocument[]> {
		const loggerContext = `${ChatRepository.name}/${this.getChats.name}`;

		const treatedChatIds = chatIds.map((id) => new Types.ObjectId(id));

		try {
			return await this.chatModel.find({ _id: { $in: treatedChatIds } });
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async editChatName(chatId: string, newName: string): Promise<ChatDocument> {
		const loggerContext = `${ChatRepository.name}/${this.createChat.name}`;

		try {
			return await this.chatModel.findByIdAndUpdate(
				chatId,
				{
					name: newName,
				},
				{ new: true }
			);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async changeUserRole(chatId: Types.ObjectId, userId: Types.ObjectId, roleId: Types.ObjectId): Promise<ChatDocument> {
		const loggerContext = `${ChatRepository.name}/${this.changeUserRole.name}`;

		try {
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
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async addUsersToChat(chatId: string, newUsers: ChatUserRights[]): Promise<ChatDocument> {
		const loggerContext = `${ChatRepository.name}/${this.addUsersToChat.name}`;

		try {
			const chat = await this.chatModel.findById(chatId);

			if (!chat || chat.softDeleted) {
				throw new HttpException('Chat does not exist or deleted', HttpStatus.NOT_FOUND);
			}

			const treatedUsers = newUsers.filter((newUser) => !chat.users.some((user) => newUser.user.toString() === user.user.toString()));

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
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async removeUsersFromChat(chatId: string, users: string[]): Promise<ChatDocument> {
		const loggerContext = `${ChatRepository.name}/${this.removeUsersFromChat.name}`;

		const treatedUserIds = users.map((id) => new Types.ObjectId(id));

		try {
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
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async softDeleteChats(chatId: string[]): Promise<void> {
		const loggerContext = `${ChatRepository.name}/${this.softDeleteChats.name}`;

		try {
			await this.chatModel.updateMany({ _id: { in: chatId } }, { $set: { softDeleted: utcDayjs().format(DEFAULT_DATE_FORMAT) } });
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async recoverySoftDeleteChats(chatId: string[]): Promise<void> {
		const loggerContext = `${ChatRepository.name}/${this.recoverySoftDeleteChats.name}`;

		try {
			await this.chatModel.updateMany({ _id: { in: chatId } }, { $set: { softDeleted: null } });
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async deleteChatById(chatId: string): Promise<void> {
		const loggerContext = `${ChatRepository.name}/${this.deleteChatById.name}`;

		try {
			return await this.chatModel.findByIdAndDelete(chatId).lean();
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async deleteChats(chatIds: string[]): Promise<void> {
		const loggerContext = `${ChatRepository.name}/${this.deleteChats.name}`;

		try {
			await this.chatModel.deleteMany({ _id: { in: chatIds } });
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async deleteAllSoftDeletedChats(): Promise<void> {
		const loggerContext = `${ChatRepository.name}/${this.deleteAllSoftDeletedChats.name}`;

		try {
			await this.chatModel.deleteMany({ softDeleted: { $ne: null } });
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async deleteSoftDeletedChatsOlderThan(date: string): Promise<void> {
		const loggerContext = `${ChatRepository.name}/${this.deleteSoftDeletedChatsOlderThan.name}`;

		try {
			await this.chatModel.deleteMany({ softDeleted: { $lte: date } });
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
