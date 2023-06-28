import { TypedRequestBody, TypedRequestParams } from "./CustomExpress";


export type TypedSignupRequestBody = TypedRequestBody<{username: string}>
export type TypedLoginCheckNameRequestParams = TypedRequestParams<{username: string}>
export type TypedLoginRequestBody = TypedRequestBody<{username: string, verificationCode: string}>
export type TypedDeleteRequestParams = TypedRequestParams<{ username: string }>
