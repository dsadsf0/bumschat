import { Injectable } from '@nestjs/common';
import { SnatchedLogger } from 'src/core/services/snatched-logger/logger.service';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as uuid from 'uuid';
import * as qrCode from 'qrcode';
import utcDayjs from 'src/core/utils/utcDayjs';
import { ErrorHandler } from 'src/core/decorators/errorHandler.decorator';

export const QR_FOLDER_NAME = 'QR-codes';

@Injectable()
export class QrService {
    constructor(private readonly logger: SnatchedLogger) {}

    @ErrorHandler(QrService.name)
    private treatQRDataUrl(qrDataURL: string): string {
        return qrDataURL.replace(/^data:image\/png+;base64,/, '').replace(/ /g, '+');
    }

    @ErrorHandler(QrService.name)
    private async otpAuthUrlToQrUrl(secretUrl: string): Promise<string> {
        return await qrCode.toDataURL(secretUrl);
    }

    @ErrorHandler(QrService.name)
    public async otpAuthUrlToQrData(secretUrl: string): Promise<string> {
        const qrDataUrl = await this.otpAuthUrlToQrUrl(secretUrl);
        return this.treatQRDataUrl(qrDataUrl);
    }

    private getFileName(): string {
        return `${utcDayjs().unix()}-${uuid.v4()}.png`;
    }

    private getLogUsername(username?: string): string {
        return username ? ` to ${username}` : '';
    }

    @ErrorHandler(QrService.name)
    public async createQrImg(treatedQRData: string, username?: string, userId?: string): Promise<string> {
        const loggerContext = `${QrService.name}/${this.createQrImg.name}`;

        const fileName = this.getFileName();

        const filePath = path.resolve(QR_FOLDER_NAME, fileName);

        await fs.ensureFile(filePath);
        await fs.writeFile(filePath, treatedQRData, { encoding: 'base64' });

        const logUsername = this.getLogUsername(username);

        this.logger.info(`Qr image ${fileName}${logUsername} has been created.`, loggerContext, {
            logEntityId: userId,
            tagInMessage: username,
        });

        return fileName;
    }

    @ErrorHandler(QrService.name)
    public async deleteQrImg(fileName: string, username?: string, userId?: string): Promise<void> {
        const loggerContext = `${QrService.name}/${this.deleteQrImg.name}`;

        const filePath = path.resolve(QR_FOLDER_NAME, fileName);

        await fs.unlink(filePath);

        const logUsername = this.getLogUsername(username);

        this.logger.info(`Qr image ${fileName}${logUsername} has been deleted.`, loggerContext, {
            logEntityId: userId,
        });
    }
}
