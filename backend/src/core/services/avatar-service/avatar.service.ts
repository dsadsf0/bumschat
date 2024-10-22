import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as uuid from 'uuid';
import utcDayjs from 'src/core/utils/utcDayjs';
import axios from 'axios';
import { SnatchedLogger } from '../snatched-logger/logger.service';
import { ErrorHandler } from 'src/core/decorators/errorHandler.decorator';

export const AvatarTo = {
    User: 'users',
    Chat: 'chats',
} as const;

export type AvatarToType = (typeof AvatarTo)[keyof typeof AvatarTo];

@Injectable()
export class AvatarService {
    constructor(private readonly logger: SnatchedLogger) {}

    private getFileName(): string {
        return `${utcDayjs().unix()}-${uuid.v4()}.png`;
    }

    private getFolderName(type: AvatarToType): string {
        return `${type}-avatars`;
    }

    @ErrorHandler(AvatarService.name)
    public async createAvatar(type: AvatarToType): Promise<string> {
        const fileName = this.getFileName();

        const filePath = path.resolve(this.getFolderName(type), fileName);

        const [{ data: avatar }] = await Promise.all([
            axios.get('https://cataas.com/cat?type=square&position=centre', { responseType: 'arraybuffer' }),
            fs.ensureFile(filePath),
        ]);

        const treatedAvatar = Buffer.from(avatar, 'binary').toString('base64');
        await fs.writeFile(filePath, treatedAvatar, { encoding: 'base64' });

        return fileName;
    }

    @ErrorHandler(AvatarService.name)
    public async editAvatar(type: AvatarToType, fileName: string, avatar: string): Promise<void> {
        const filePath = path.resolve(this.getFolderName(type), fileName);

        await fs.ensureFile(filePath);
        await fs.writeFile(filePath, avatar, { encoding: 'base64' });
    }

    @ErrorHandler(AvatarService.name)
    public async deleteAvatar(type: AvatarToType, fileName: string): Promise<void> {
        const filePath = path.resolve(this.getFolderName(type), fileName);

        await fs.unlink(filePath);
    }
}
