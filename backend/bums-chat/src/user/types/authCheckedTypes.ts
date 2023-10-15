import { UserGetRdo } from '../rdo/user-get.rdo';
import { Request } from 'express';

export type AuthCheckedRequest = { user: UserGetRdo } & Request;
export type AuthCheckedAdmin = { admin: UserGetRdo } & Request;
