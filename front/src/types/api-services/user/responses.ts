import { User } from '@/types/user';

export type RejectOptions = {
	rejectValue: string;
};

export type SignupResponse = {
	user: User;
	recoverySecret: string;
};

export type UsernameCheckResponse = boolean;

export type RequestTokenResponse = {
	token: string;
	publicKey: string;
};
