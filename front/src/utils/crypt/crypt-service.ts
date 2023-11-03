import NodeRsa from 'node-rsa';

class CryptService {
	#cryptRsa: NodeRsa;

	#encryptingRsa: NodeRsa;

	public isKeysUpdating = false;

	constructor() {
		this.#cryptRsa = new NodeRsa({ b: 2048 });
		this.#encryptingRsa = new NodeRsa();
	}

	public async updateKeyPair(): Promise<void> {
		this.isKeysUpdating = true;
		await new Promise((resolve) => {
			this.#cryptRsa.generateKeyPair(2048);
			resolve('ok');
		});
		this.isKeysUpdating = false;
	}

	public getPublicKey(): string {
		return this.#cryptRsa.exportKey('public');
	}

	public encrypt(data: string, publicKey: string): string {
		this.#encryptingRsa.importKey(publicKey, 'public');
		return this.#encryptingRsa.encrypt(data, 'base64');
	}

	public decrypt(encryptedData: string): string {
		return this.#cryptRsa.decrypt(encryptedData, 'utf8');
	}
}

export default CryptService;
