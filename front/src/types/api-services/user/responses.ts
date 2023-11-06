import { User } from '@/types/User';

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
