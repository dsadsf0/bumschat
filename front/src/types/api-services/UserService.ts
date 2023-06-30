import { IUser } from "../User";

export interface ISignupResponse {
    user: IUser, 
    qrImg: string, 
    recoveryPass: string
}