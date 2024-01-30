import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigSchema } from 'src/app/app.schema';
import { SnatchedLogger } from 'src/core/services/snatched-logger/logger.service';
import handleError from 'src/core/utils/errorHandler';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import * as NodeRsa from 'node-rsa';

@Injectable()
export class CryptoService {
    private globalRsa: NodeRsa;

    private cryptRsa: NodeRsa;

    constructor(
        private readonly config: ConfigService<AppConfigSchema>,
        private readonly logger: SnatchedLogger
    ) {
        this.cryptRsa = new NodeRsa({ b: 2048 });
        this.globalRsa = new NodeRsa();
        this.globalRsa.importKey(this.config.get('GLOBAL_PUBLIC_KEY').replace(/\\n/g, '\n'), 'public');
        this.globalRsa.importKey(this.config.get('GLOBAL_PRIVATE_KEY').replace(/\\n/g, '\n'), 'private');
    }

    public updateKeyPair(): void {
        this.cryptRsa.generateKeyPair();
    }

    public getGlobalPublicKey(): string {
        const loggerContext = `${CryptoService.name}/${this.getGlobalPublicKey.name}`;

        try {
            return this.globalRsa.exportKey('public');
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public getPublicKey(): string {
        const loggerContext = `${CryptoService.name}/${this.getPublicKey.name}`;

        try {
            return this.cryptRsa.exportKey('public');
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public encrypt(data: string, publicKey: string): string {
        const loggerContext = `${CryptoService.name}/${this.encrypt.name}`;
        try {
            const encryptRsa = new NodeRsa(publicKey, 'public');
            return encryptRsa.encrypt(data, 'base64');
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public decrypt(encryptedData: string): string {
        const loggerContext = `${CryptoService.name}/${this.decrypt.name}`;
        try {
            return this.cryptRsa.decrypt(encryptedData, 'utf8');
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public globalDecrypt(encryptedData: string): string {
        const loggerContext = `${CryptoService.name}/${this.globalDecrypt.name}`;
        try {
            return this.globalRsa.decrypt(encryptedData, 'utf8');
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public globalDecryptPrivate(encryptedData: string): string {
        const loggerContext = `${CryptoService.name}/${this.globalDecryptPrivate.name}`;
        try {
            return this.globalRsa.decryptPublic(encryptedData, 'utf8');
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public globalEncrypt(encryptedData: string): string {
        const loggerContext = `${CryptoService.name}/${this.globalEncrypt.name}`;
        try {
            return this.globalRsa.encrypt(encryptedData, 'base64');
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public globalEncryptPrivate(encryptedData: string): string {
        const loggerContext = `${CryptoService.name}/${this.globalEncryptPrivate.name}`;
        try {
            return this.globalRsa.encryptPrivate(encryptedData, 'base64');
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public shortPassGen(): string {
        return Math.random().toString(36).slice(2, 10);
    }

    public uuidV5(content: string): string {
        const loggerContext = `${CryptoService.name}/${this.uuidV5.name}`;

        try {
            return uuid.v5(content, this.config.get('UUID_NAMESPACE'));
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public async hash(content: string, saltOrRounds: string | number): Promise<string> {
        const loggerContext = `${CryptoService.name}/${this.hash.name}`;

        try {
            return await bcrypt.hash(content, saltOrRounds);
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public async uuidAndHash(content: string, saltOrRounds: string | number): Promise<string> {
        const loggerContext = `${CryptoService.name}/${this.uuidAndHash.name}`;

        try {
            const contentUuid = this.uuidV5(content);
            return await this.hash(contentUuid, saltOrRounds);
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public async validateUuidAndHash(supposedData: string, hash: string): Promise<boolean> {
        const loggerContext = `${CryptoService.name}/${this.validateUuidAndHash.name}`;

        try {
            const supposedUuid = this.uuidV5(supposedData);
            return await bcrypt.compare(supposedUuid, hash);
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }

    public async validateHash(supposedData: string, hash: string): Promise<boolean> {
        const loggerContext = `${CryptoService.name}/${this.validateHash.name}`;

        try {
            return await bcrypt.compare(supposedData, hash);
        } catch (error) {
            this.logger.error(error, loggerContext);
            handleError(error);
        }
    }
}
