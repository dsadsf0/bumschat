export type LoginRequest = {
    username: string;
    verificationCode: string;
};

export type SignupRequest = {
    username: string;
    publicKey: string;
};

export type UsernameCheckRequest = {
    username: string;
};

export type RecoveryRequest = {
    username: string;
    recoverySecret: string;
};
