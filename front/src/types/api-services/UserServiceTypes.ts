import { IUser } from "../User";

export interface IRejectOptions {
    rejectValue: string,
}

export interface ISignupResponse {
    user: IUser, 
    qrImg: string, 
    recoveryPass: string,
}

export interface ILoginRequest {
    username: string,
    verificationCode: string,
}