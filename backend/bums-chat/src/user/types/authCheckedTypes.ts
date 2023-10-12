import { Users } from '../user.model';
import { Request } from 'express';

export type AuthCheckedRequest = { user: Users } & Request;
