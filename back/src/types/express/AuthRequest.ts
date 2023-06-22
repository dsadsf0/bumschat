import { TypedRequestBody, TypedRequestParams } from "./CustomExpress";


export type TypedSignupRequestBody = TypedRequestBody<{username: string}>
export type TypedLoginCheckNameRequestBody = TypedRequestParams<{username: string}>
export type TypedLoginRequestBody = TypedRequestBody<{username: string, verificationCode: string}>
