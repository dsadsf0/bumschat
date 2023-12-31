import { Injectable } from '@nestjs/common';
import { SnatchedService } from 'src/modules/snatchedLogger/logger.service';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as uuid from 'uuid';
import * as qrcode from 'qrcode';
import handleError from 'src/core/utils/errorHandler';

const QR_NAME_DELIMITER = '_';

export const QR_FOLDER_NAME = 'QR-codes';

@Injectable()
export class QrService {
	constructor(private readonly logger: SnatchedService) {}

	public treatQRDataUrl(qrDataURL: string): string {
		const loggerContext = `${QrService.name}/${this.treatQRDataUrl.name}`;
		try {
			return qrDataURL.replace(/^data:image\/png+;base64,/, '').replace(/ /g, '+');
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async otpAuthUrlToQrUrl(secretUrl: string): Promise<string> {
		const loggerContext = `${QrService.name}/${this.otpAuthUrlToQrUrl.name}`;

		try {
			return await qrcode.toDataURL(secretUrl);
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

	public async createQrImg(username: string, treatedQRData: string): Promise<string> {
		const loggerContext = `${QrService.name}/${this.createQrImg.name}`;

		try {
			const fileName = `${username}${QR_NAME_DELIMITER}${uuid.v4()}.png`;

			const filePath = path.resolve(QR_FOLDER_NAME, fileName);

			await fs.ensureFile(filePath);
			await fs.writeFile(filePath, treatedQRData, { encoding: 'base64' });

			this.logger.info(`Qr image to ${username} has been created.`, loggerContext, username);

			return fileName;
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}

	public async deleteQrImg(fileName: string): Promise<void> {
		const loggerContext = `${QrService.name}/${this.deleteQrImg.name}`;

		try {
			const filePath = path.resolve(QR_FOLDER_NAME, fileName);
			const [username] = fileName.split(QR_NAME_DELIMITER);

			await fs.unlink(filePath);

			this.logger.info(`Qr image to ${username} has been deleted.`, loggerContext, username);
		} catch (error) {
			this.logger.error(error, loggerContext);
			handleError(error);
		}
	}
}
