import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as fs from 'fs-extra';

const MILLISECONDS_IN_SECOND = 60000;

@Injectable()
export class SnatchedService extends ConsoleLogger {
	private readonly logsDirectory = 'logs';

	private readonly logFileName = 'logs';

	private readonly logFileExtension = 'log';

	private readonly maxLogFileSize = 2_048_000;

	constructor() {
		super();
	}

	private getLogFilePath(username?: string): string {
		const usernamePath = username ? `/${username}` : '';
		return `${this.logsDirectory}${usernamePath}/${this.logFileName}.${this.logFileExtension}`;
	}

	private async checkLogFileSize(filePath: string): Promise<void> {
		try {
			const stats = fs.statSync(filePath);

			if (stats.size >= this.maxLogFileSize) {
				const [fileName] = filePath
					.split('/')
					.find((str) => str.includes('.'))
					.split('.');
				const newFileName = `${fileName}_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}`;
				const newFilePath = filePath.replace(`${fileName}.${this.logFileExtension}`, `${newFileName}.${this.logFileExtension}`);
				await fs.rename(filePath, newFilePath);
				fs.ensureFileSync(filePath);
			}
		} catch (error) {
			if (error?.message && typeof error.message === 'string' && error.message.includes('no such file or directory')) {
				super.warn(error + '. But has been created now');
				fs.ensureFileSync(filePath);
			} else {
				super.error(error);
			}
		}
	}

	private async logToFile(message: string, context?: string, username?: string): Promise<void> {
		try {
			const logFilePath = this.getLogFilePath(username);

			await this.checkLogFileSize(logFilePath);

			const timezoneOffset = new Date().getTimezoneOffset() * MILLISECONDS_IN_SECOND;

			fs.ensureFileSync(logFilePath);
			fs.appendFileSync(logFilePath, `[${new Date(Date.now() - timezoneOffset).toISOString().slice(0, -1)}] [${context}] ${message}\n`);
		} catch (error) {
			super.error(error);
		}
	}

	private highlightUsername(message: string, username: string, type: 'error' | 'warn' | 'info' | 'debug'): string {
		switch (type) {
			case 'debug':
				return message.replace(username, `\x1b[1m\x1b[34m${username}\x1b[22m\x1b[35m`);
			case 'info':
				return message.replace(username, `\x1b[1m\x1b[34m${username}\x1b[22m\x1b[32m`);
			case 'warn':
				return message.replace(username, `\x1b[1m\x1b[34m${username}\x1b[22m\x1b[33m`);
			case 'error':
				return message.replace(username, `\x1b[1m\x1b[34m${username}\x1b[22m\x1b[31m`);
		}
	}

	public debug(message: unknown, context = '', username?: string): void {
		try {
			const textMessage = JSON.stringify(message);
			const treatedMessage = username ? this.highlightUsername(textMessage, username, 'debug') : message;

			super.debug(treatedMessage, context);

			this.logToFile(textMessage, context, username);
		} catch (error) {
			super.error(error);
		}
	}

	public info(message: unknown, context = '', username?: string): void {
		try {
			const textMessage = JSON.stringify(message);
			const treatedMessage = username ? this.highlightUsername(textMessage, username, 'info') : message;

			super.log(treatedMessage, context);

			this.logToFile(textMessage, context, username);
		} catch (error) {
			super.error(error);
		}
	}

	public warn(message: unknown, context = '', username?: string): void {
		try {
			const textMessage = JSON.stringify(message);
			const treatedMessage = username ? this.highlightUsername(textMessage, username, 'warn') : message;

			super.warn(treatedMessage, context);

			this.logToFile(`WARNING: ${textMessage}`, context, username);
		} catch (error) {
			super.error(error);
		}
	}

	public error(message: unknown, context = '', username?: string, trace?: string): void {
		try {
			const textMessage = JSON.stringify(message);
			const treatedMessage = username ? this.highlightUsername(textMessage, username, 'error') : message;

			super.error(treatedMessage, trace, context);

			const errorMessage = trace ? `ERROR: ${textMessage}\nStack Trace:\n${trace}` : `ERROR: ${textMessage}`;
			this.logToFile(errorMessage, context, username);
		} catch (error) {
			super.error(error);
		}
	}
}
