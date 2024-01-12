import { Injectable } from '@nestjs/common';
import { SnatchedService } from '../snatched-logger/logger.service';
import handleError from 'src/core/utils/errorHandler';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as uuid from 'uuid';
import utcDayjs from 'src/core/utils/utcDayjs';
import axios from 'axios';

export const AvatarTo = {
	User: 'user',
	Chat: 'chat',
} as const;
export type AvatarToType = (typeof AvatarTo)[keyof typeof AvatarTo];

@Injectable()
export class AvatarService {
	constructor(private readonly logger: SnatchedService) {}

	public getFileName(): string {
		return `${utcDayjs().unix}-${uuid.v4()}.png`;
	}

	public getFolderName(type: AvatarToType): string {
		return `${AvatarTo[type]}-avatars`;
	}

	public async createAvatar(type: AvatarToType): Promise<string> {
		const loggerContext = `${AvatarService.name}/${this.createAvatar.name}`;

		try {
			const fileName = this.getFileName();

			const filePath = path.resolve(this.getFolderName(type), fileName);

			// получаем фото котика и создаем файл для него
			const [{ data: avatar }] = await Promise.all([axios.get('https://cataas.com/cat?type=square&position=centre'), fs.ensureFile(filePath)]);

			await fs.writeFile(filePath, avatar, { encoding: 'base64' });

			console.log(avatar);

			return fileName;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async editAvatar(type: AvatarToType, fileName: string, avatar: string): Promise<void> {
		const loggerContext = `${AvatarService.name}/${this.createAvatar.name}`;

		try {
			const filePath = path.resolve(this.getFolderName(type), fileName);

			await fs.ensureFile(filePath);
			await fs.writeFile(filePath, avatar, { encoding: 'base64' });
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async deleteAvatar(type: AvatarToType, fileName: string): Promise<void> {
		const loggerContext = `${AvatarService.name}/${this.createAvatar.name}`;

		try {
			const filePath = path.resolve(this.getFolderName(type), fileName);

			await fs.unlink(filePath);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
