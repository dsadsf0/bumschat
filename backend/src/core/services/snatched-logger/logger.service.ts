import { Injectable, ConsoleLogger, LogLevel, HttpException } from '@nestjs/common';
import * as fs from 'fs-extra';
import utcDayjs from 'src/core/utils/utcDayjs';

type Options = {
    tagInMessage?: string;
    logEntityId?: string;
};

@Injectable()
export class SnatchedLogger extends ConsoleLogger {
    private readonly logsDirectory = 'logs';

    private readonly logFileName = 'logs';

    private readonly logFileExtension = 'log';

    private readonly maxLogFileSize = 2_048_000;

    private readonly logLevel: LogLevel = 'log';

    private readonly consoleDateFormat = 'YYYY-MM-DD HH:mm:ss:SSS';

    private readonly unavailablePathSymbolsRegex = /['"\/|\\:*<>?]/g;

    private readonly indentSpaces = 4;

    constructor() {
        super();
    }

    private getLogFilePath(logEntityId?: string): string {
        const logEntityIdPath = logEntityId ? `/${logEntityId}` : '';
        return `${this.logsDirectory}${logEntityIdPath}/${this.logFileName}.${this.logFileExtension}`;
    }

    private async ensureLogFile(filePath: string): Promise<void> {
        try {
            const stats = fs.statSync(filePath);

            if (stats.size >= this.maxLogFileSize) {
                const [fileName] = filePath
                    .split('/')
                    .find((str) => str.includes('.'))
                    .split('.');
                const newFileName = `${fileName}_${utcDayjs().format('YYYY-MM-DD_HH-mm-ss')}`;
                const newFilePath = filePath.replace(
                    `${fileName}.${this.logFileExtension}`,
                    `${newFileName}.${this.logFileExtension}`
                );
                await fs.rename(filePath, newFilePath);
                fs.ensureFileSync(filePath);
            }
        } catch (error) {
            if (
                error?.message &&
                typeof error.message === 'string' &&
                error.message.includes('no such file or directory')
            ) {
                super.warn(error + '. But has created');
                fs.ensureFileSync(filePath);
            } else {
                super.error(error);
            }
        }
    }

    private async logToFile(message: string, context?: string, logEntityId?: string): Promise<void> {
        try {
            const treatedLogEntityId = logEntityId?.replaceAll(this.unavailablePathSymbolsRegex, '');
            const logFilePath = this.getLogFilePath(treatedLogEntityId);

            await this.ensureLogFile(logFilePath);

            fs.ensureFileSync(logFilePath);
            fs.appendFileSync(logFilePath, `[${utcDayjs().format(this.consoleDateFormat)}] [${context}] ${message}\n`);
        } catch (error) {
            super.error(error);
        }
    }

    private stringify(message: unknown): string {
        return JSON.stringify(message, null, this.indentSpaces);
    }

    private treatTextMessage(message: unknown): string {
        if (typeof message === 'string') {
            return message;
        }
        if (message instanceof HttpException) {
            return this.stringify(message);
        }
        if (message instanceof Error) {
            const logId = (message as unknown as { id: string })?.id || null;

            return this.stringify({
                name: message.name,
                message: message.message,
                id: logId,
            });
        }
        return this.stringify(message);
    }

    private treatLogMessage(message: unknown): string {
        return this.stringify(message);
    }

    private highlightTag(message: string, tagInMessage: string, type: Exclude<LogLevel, 'verbose'>): string {
        switch (type) {
            case 'debug':
                return message.replaceAll(tagInMessage, `\x1b[1m\x1b[34m${tagInMessage}\x1b[0m\x1b[35m`);
            case 'log':
                return message.replaceAll(tagInMessage, `\x1b[1m\x1b[34m${tagInMessage}\x1b[0m\x1b[32m`);
            case 'warn':
                return message.replaceAll(tagInMessage, `\x1b[1m\x1b[34m${tagInMessage}\x1b[0m\x1b[33m`);
            case 'error':
                return message.replaceAll(tagInMessage, `\x1b[1m\x1b[34m${tagInMessage}\x1b[0m\x1b[31m`);
            default:
                return message;
        }
    }

    public trace(context: string, ...messages: unknown[]): void {
        try {
            if (!messages.length) {
                super.printMessages([''], `\x1b[1m\x1b[37m${context}\x1b[0m\x1b[33m`, this.logLevel);
                return;
            }
            const colorizedMessages = messages.map(
                (message) => `\x1b[1m\x1b[37m${this.treatTextMessage(message)}\x1b[0m\x1b[32m`
            );
            super.printMessages(colorizedMessages, `\x1b[1m\x1b[37m${context}\x1b[0m\x1b[33m`, this.logLevel);
        } catch (error) {
            super.error(error);
        }
    }

    public debug(message: unknown, context = '', { tagInMessage, logEntityId }: Options = {}): void {
        try {
            const textMessage = this.treatTextMessage(message);
            const treatedMessage = tagInMessage ? this.highlightTag(textMessage, tagInMessage, 'debug') : textMessage;

            super.debug(treatedMessage, context);

            this.logToFile(`DEBUG: ${this.treatLogMessage(message)}`, context, logEntityId);
        } catch (error) {
            super.error(error);
        }
    }

    public info(message: unknown, context = '', { tagInMessage, logEntityId }: Options = {}): void {
        try {
            const textMessage = this.treatTextMessage(message);
            const treatedMessage = tagInMessage ? this.highlightTag(textMessage, tagInMessage, 'log') : textMessage;

            super.log(treatedMessage, context);

            this.logToFile(`LOG: ${this.treatLogMessage(message)}`, context, logEntityId);
        } catch (error) {
            super.error(error);
        }
    }

    public warn(message: unknown, context = '', { tagInMessage, logEntityId }: Options = {}): void {
        try {
            const textMessage = this.treatTextMessage(message);
            const treatedMessage = tagInMessage ? this.highlightTag(textMessage, tagInMessage, 'warn') : textMessage;

            super.warn(treatedMessage, context);

            this.logToFile(`WARNING: ${this.treatLogMessage(message)}`, context, logEntityId);
        } catch (error) {
            super.error(error);
        }
    }

    public error(message: unknown, context = '', options: string | Options = {}): void {
        try {
            const { tagInMessage, logEntityId } = typeof options === 'string' ? ({} as Options) : options;
            const textMessage = this.treatTextMessage(message);
            const treatedMessage = tagInMessage ? this.highlightTag(textMessage, tagInMessage, 'error') : textMessage;

            super.error(treatedMessage, context);

            this.logToFile(`ERROR: ${this.treatLogMessage(message)}`, context, logEntityId);
        } catch (error) {
            super.error(error);
        }
    }
}
