import { TypedRequestBody, TypedRequestParams } from "./CustomExpress";
import { UserInterface } from '../models/UserTypes';


export type TypedSignupRequestBody = TypedRequestBody<{username: string}>;
export type TypedLoginCheckNameRequestParams = TypedRequestParams<{username: string}>;
export type TypedLoginRequestBody = TypedRequestBody<{username: string, verificationCode: string}>;
export type TypedDeleteRequestParams = TypedRequestParams<{ username: string }>;
export type AuthCheckedRequest<T> = T & {user: UserInterface};
export type TypedRecoveryUserRequestBody = TypedRequestBody<{username: string, recoveryPass: string}>