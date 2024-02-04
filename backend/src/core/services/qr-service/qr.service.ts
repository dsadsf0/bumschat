import { Injectable } from '@nestjs/common';
import { SnatchedLogger } from 'src/core/services/snatched-logger/logger.service';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as uuid from 'uuid';
import * as qrCode from 'qrcode';
import handleError from 'src/core/utils/errorHandler';
import utcDayjs from 'src/core/utils/utcDayjs';

export const QR_FOLDER_NAME = 'QR-codes';

@Injectable()
export class QrService {
    constructor(private readonly logger: SnatchedLogger) {}

    private treatQRDataUrl(qrDataURL: string): string {
        const loggerContext = `${QrService.name}/${this.treatQRDataUrl.name}`;
        try {
            return qrDataURL.replace(/^data:image\/png+;base64,/, '').replace(/ /g, '+');
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    private async otpAuthUrlToQrUrl(secretUrl: string): Promise<string> {
        const loggerContext = `${QrService.name}/${this.otpAuthUrlToQrUrl.name}`;

        try {
            return await qrCode.toDataURL(secretUrl);
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public async otpAuthUrlToQrData(secretUrl: string): Promise<string> {
        const loggerContext = `${QrService.name}/${this.otpAuthUrlToQrData.name}`;

        try {
            const qrDataUrl = await this.otpAuthUrlToQrUrl(secretUrl);
            return this.treatQRDataUrl(qrDataUrl);
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    private getFileName(): string {
        return `${utcDayjs().unix()}-${uuid.v4()}.png`;
    }

    private getLogUsername(username?: string): string {
        return username ? ` to ${username}` : '';
    }

    public async createQrImg(treatedQRData: string, username?: string, userId?: string): Promise<string> {
        const loggerContext = `${QrService.name}/${this.createQrImg.name}`;

        try {
            const fileName = this.getFileName();

            const filePath = path.resolve(QR_FOLDER_NAME, fileName);

            await fs.ensureFile(filePath);
            await fs.writeFile(filePath, treatedQRData, { encoding: 'base64' });

            const logUsername = this.getLogUsername(username);

            this.logger.info(`Qr image ${fileName}${logUsername} has been created.`, loggerContext, username, userId);

            return fileName;
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public async deleteQrImg(fileName: string, username?: string, userId?: string): Promise<void> {
        const loggerContext = `${QrService.name}/${this.deleteQrImg.name}`;

        try {
            const filePath = path.resolve(QR_FOLDER_NAME, fileName);

            await fs.unlink(filePath);

            const logUsername = this.getLogUsername(username);

            this.logger.info(`Qr image ${fileName}${logUsername} has been deleted.`, loggerContext, username, userId);
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }
}
