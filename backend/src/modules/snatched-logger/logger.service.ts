import { Injectable, ConsoleLogger, LogLevel } from '@nestjs/common';
import * as fs from 'fs-extra';
import utcDayjs from 'src/core/utils/utcDayjs';

const MILLISECONDS_IN_SECOND = 60000;

const UNAVAILABLE_SYMBLOS_REGEX = /['"\/|\\:*<>?]/g;

@Injectable()
export class SnatchedService extends ConsoleLogger {
	private readonly logsDirectory = 'logs';

	private readonly logFileName = 'logs';

	private readonly logFileExtension = 'log';

	private readonly maxLogFileSize = 2_048_000;

	private readonly logLevel: LogLevel = 'log';

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
				const newFileName = `${fileName}_${utcDayjs().format('YYYY-MM-DD_HH-mm-ss')}`;
				const newFilePath = filePath.replace(`${fileName}.${this.logFileExtension}`, `${newFileName}.${this.logFileExtension}`);
				await fs.rename(filePath, newFilePath);
				fs.ensureFileSync(filePath);
			}
		} catch (error) {
			if (error?.message && typeof error.message === 'string' && error.message.includes('no such file or directory')) {
				super.warn(error + '. But has created');
				fs.ensureFileSync(filePath);
			} else {
				super.error(error);
			}
		}
	}

	private async logToFile(message: string, context?: string, userId?: string): Promise<void> {
		try {
			const treatedUserid = userId?.replaceAll(UNAVAILABLE_SYMBLOS_REGEX, '');
			const logFilePath = this.getLogFilePath(treatedUserid);

			await this.checkLogFileSize(logFilePath);

			const timezoneOffset = new Date().getTimezoneOffset() * MILLISECONDS_IN_SECOND;

			fs.ensureFileSync(logFilePath);
			fs.appendFileSync(logFilePath, `[${new Date(Date.now() - timezoneOffset).toISOString().slice(0, -1)}] [${context}] ${message}\n`);
		} catch (error) {
			super.error(error);
		}
	}

	public treatTextMessage(message: unknown): string {
		return typeof message === 'string' ? message : JSON.stringify(message);
	}

	public treatLogMessage(message: unknown): string {
		return JSON.stringify(message);
	}

	private highlightUsername(message: string, username: string, type: 'error' | 'warn' | 'info' | 'debug'): string {
		switch (type) {
			case 'debug':
				return message.replaceAll(username, `\x1b[1m\x1b[34m${username}\x1b[0m\x1b[35m`);
			case 'info':
				return message.replaceAll(username, `\x1b[1m\x1b[34m${username}\x1b[0m\x1b[32m`);
			case 'warn':
				return message.replaceAll(username, `\x1b[1m\x1b[34m${username}\x1b[0m\x1b[33m`);
			case 'error':
				return message.replaceAll(username, `\x1b[1m\x1b[34m${username}\x1b[0m\x1b[31m`);
		}
	}

	public log(context: string, ...messages: unknown[]): void {
		try {
			if (!messages.length) {
				super.printMessages([''], `\x1b[1m\x1b[37m${context}\x1b[0m\x1b[33m`, this.logLevel);
				return;
			}
			const colorizedMessages = messages.map((message) => `\x1b[1m\x1b[37m${this.treatTextMessage(message)}\x1b[0m\x1b[32m`);
			super.printMessages(colorizedMessages, `\x1b[1m\x1b[37m${context}\x1b[0m\x1b[33m`, this.logLevel);
		} catch (error) {
			super.error(error);
		}
	}

	public debug(message: unknown, context = '', username?: string, userId?: string): void {
		try {
			const textMessage = this.treatTextMessage(message);
			const treatedMessage = username ? this.highlightUsername(textMessage, username, 'debug') : textMessage;

			super.debug(treatedMessage, context);

			this.logToFile(this.treatLogMessage(message), context, userId);
		} catch (error) {
			super.error(error);
		}
	}

	public info(message: unknown, context = '', username?: string, userId?: string): void {
		try {
			const textMessage = this.treatTextMessage(message);
			const treatedMessage = username ? this.highlightUsername(textMessage, username, 'info') : textMessage;

			super.log(treatedMessage, context);

			this.logToFile(this.treatLogMessage(message), context, userId);
		} catch (error) {
			super.error(error);
		}
	}

	public warn(message: unknown, context = '', username?: string, userId?: string): void {
		try {
			const textMessage = this.treatTextMessage(message);
			const treatedMessage = username ? this.highlightUsername(textMessage, username, 'warn') : textMessage;

			super.warn(treatedMessage, context);

			this.logToFile(`WARNING: ${this.treatLogMessage(message)}`, context, userId);
		} catch (error) {
			super.error(error);
		}
	}

	public error(message: unknown, context = '', username?: string, userId?: string): void {
		try {
			const textMessage = this.treatTextMessage(message);
			const treatedMessage = username ? this.highlightUsername(textMessage, username, 'error') : textMessage;

			super.error(treatedMessage, context);

			this.logToFile(`ERROR: ${this.treatLogMessage(message)}`, context, userId);
		} catch (error) {
			super.error(error);
		}
	}
}
