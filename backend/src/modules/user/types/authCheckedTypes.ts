import { UserGetRdo } from '../rdo/get-user.rdo';
import { Request } from 'express';

export type AuthCheckedRequest = { user: UserGetRdo } & Request;
