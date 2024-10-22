import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigSchema } from 'src/app/app.schema';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import * as NodeRsa from 'node-rsa';
import { ErrorHandler } from 'src/core/decorators/errorHandler.decorator';

@Injectable()
export class CryptoService {
    private globalRsa: NodeRsa;

    private cryptRsa: NodeRsa;

    constructor(private readonly config: ConfigService<AppConfigSchema>) {
        this.cryptRsa = new NodeRsa({ b: 2048 });
        this.globalRsa = new NodeRsa();
        this.globalRsa.importKey(this.config.get('GLOBAL_PUBLIC_KEY').replace(/\\n/g, '\n'), 'public');
        this.globalRsa.importKey(this.config.get('GLOBAL_PRIVATE_KEY').replace(/\\n/g, '\n'), 'private');
    }

    public updateKeyPair(): void {
        this.cryptRsa.generateKeyPair();
    }

    @ErrorHandler(CryptoService.name)
    public getGlobalPublicKey(): string {
        return this.globalRsa.exportKey('public');
    }

    @ErrorHandler(CryptoService.name)
    public getPublicKey(): string {
        return this.cryptRsa.exportKey('public');
    }

    @ErrorHandler(CryptoService.name)
    public encrypt(data: string, publicKey: string): string {
        const encryptRsa = new NodeRsa(publicKey, 'public');
        return encryptRsa.encrypt(data, 'base64');
    }

    @ErrorHandler(CryptoService.name)
    public decrypt(encryptedData: string): string {
        return this.cryptRsa.decrypt(encryptedData, 'utf8');
    }

    @ErrorHandler(CryptoService.name)
    public globalDecrypt(encryptedData: string): string {
        return this.globalRsa.decrypt(encryptedData, 'utf8');
    }

    @ErrorHandler(CryptoService.name)
    public globalDecryptPrivate(encryptedData: string): string {
        return this.globalRsa.decryptPublic(encryptedData, 'utf8');
    }

    @ErrorHandler(CryptoService.name)
    public globalEncrypt(encryptedData: string): string {
        return this.globalRsa.encrypt(encryptedData, 'base64');
    }

    @ErrorHandler(CryptoService.name)
    public globalEncryptPrivate(encryptedData: string): string {
        return this.globalRsa.encryptPrivate(encryptedData, 'base64');
    }

    public shortPassGen(): string {
        return Math.random().toString(36).slice(2, 10);
    }

    @ErrorHandler(CryptoService.name)
    public uuidV5(content: string): string {
        return uuid.v5(content, this.config.get('UUID_NAMESPACE'));
    }

    @ErrorHandler(CryptoService.name)
    public async hash(content: string, saltOrRounds: string | number): Promise<string> {
        return await bcrypt.hash(content, saltOrRounds);
    }

    @ErrorHandler(CryptoService.name)
    public async uuidAndHash(content: string, saltOrRounds: string | number): Promise<string> {
        const contentUuid = this.uuidV5(content);
        return await this.hash(contentUuid, saltOrRounds);
    }

    @ErrorHandler(CryptoService.name)
    public async validateUuidAndHash(supposedData: string, hash: string): Promise<boolean> {
        const supposedUuid = this.uuidV5(supposedData);
        return await bcrypt.compare(supposedUuid, hash);
    }

    @ErrorHandler(CryptoService.name)
    public async validateHash(supposedData: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(supposedData, hash);
    }
}
