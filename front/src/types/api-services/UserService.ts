import { IUser } from "../User";

export interface ISignupResponse {
    user: IUser, 
    qrImg: string, 
    recoveryPass: string,
}

export interface IRejectOptions {
    rejectValue: string,
}