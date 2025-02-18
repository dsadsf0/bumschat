import NodeRsa from 'node-rsa';

const KEY_BITS = 2048;

class CryptService {
    #cryptRsa: NodeRsa;

    #encryptRsa: NodeRsa;

    public isKeysUpdating = false;

    constructor() {
        this.#cryptRsa = new NodeRsa({ b: KEY_BITS });
        this.#encryptRsa = new NodeRsa();
    }

    public async updateKeyPair(): Promise<void> {
        this.isKeysUpdating = true;
        await new Promise((resolve) => {
            this.#cryptRsa.generateKeyPair(KEY_BITS);
            resolve('ok');
        });
        this.isKeysUpdating = false;
    }

    public getPublicKey(): string {
        return this.#cryptRsa.exportKey('public');
    }

    public setEncryptKey(publicKey: string): void {
        this.#encryptRsa.importKey(publicKey, 'public');
    }

    public encrypt(data: string): string {
        return this.#encryptRsa.encrypt(data, 'base64');
    }

    public encryptByKey(data: string, publicKey: string): string {
        const keyRsa = new NodeRsa().importKey(publicKey, 'public');
        return keyRsa.encrypt(data, 'base64');
    }

    public decrypt(encryptedData: string): string {
        return this.#cryptRsa.decrypt(encryptedData, 'utf8');
    }
}

export default new CryptService();
