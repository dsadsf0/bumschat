import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DocumentModel } from 'src/core/types/document-model.type';
import utcDayjs from 'src/core/utils/utcDayjs';
import { ChatType } from './types/chat.type';
import { Models } from 'src/core/consts/models';
import { Types } from 'mongoose';
import { ChatUserRights, ChatUserRightsSchema } from './types/chat-user-rights.type';

export type ChatDocument = DocumentModel<Chat>;

// TODO: протестировать круд чатов особенно ChatUserRights
@Schema()
export class Chat {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    avatar: string;

    @Prop({ type: String, required: true })
    type: ChatType;

    @Prop({ required: true, type: [ChatUserRightsSchema] })
    users: ChatUserRights[];

    @Prop({ required: true, type: Types.ObjectId, ref: Models.User })
    owner: Types.ObjectId;

    @Prop({ type: String, default: '#FFB5FF' })
    ownerColor?: string;

    @Prop({ type: Date, default: utcDayjs().toDate() })
    createdAt?: Date;

    @Prop({ type: Date, default: utcDayjs().toDate() })
    updatedAt?: Date;

    @Prop({ type: String, default: null })
    softDeleted?: string | null;
}

export const ChatSchema = SchemaFactory.createForClass(Chat)
    .index({ owner: 1 })
    .index({ owner: 1, name: 1 })
    .index({ softDeleted: 1 })
    .index({ createdAt: 1 })
    .index({ updatedAt: 1 });
