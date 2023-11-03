import { Crypt } from '@/types/Crypt';
import CryptService from './crypt-service';

const crypt: Crypt = {
	service: {} as CryptService,
};

export const initCrypt = async (): Promise<void> => {
	crypt.service = new CryptService();
};

export const getCrypt = (): CryptService => crypt.service;
