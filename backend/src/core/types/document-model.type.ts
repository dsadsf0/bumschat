import { Types } from 'mongoose';

export type DocumentModel<T> = T & { _id: Types.ObjectId };
