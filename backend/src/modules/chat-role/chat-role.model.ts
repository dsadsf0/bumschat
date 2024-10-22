import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { DocumentModel } from 'src/core/types/document-model.type';
import utcDayjs from 'src/core/utils/utcDayjs';
import { Models } from 'src/core/consts/models';
import { DEFAULT_CHAT_ROLE_NAME } from 'src/core/consts/roles';

export type ChatRoleDocument = DocumentModel<ChatRole>;

@Schema()
export class ChatRole {
    @Prop({ required: true, type: Types.ObjectId, ref: Models.Chat })
    chat: Types.ObjectId;

    @Prop({ type: String, default: DEFAULT_CHAT_ROLE_NAME })
    name?: string;

    @Prop({ type: String, default: '#71bc78' })
    color?: string;

    @Prop({ type: Boolean, default: true })
    canSendTextMessages?: boolean;

    @Prop({ type: Boolean, default: true })
    canSendMediaMessages?: boolean;

    @Prop({ type: Boolean, default: false })
    canDeleteSelfMessages?: boolean;

    @Prop({ type: Boolean, default: false })
    canEditSelfMessages?: boolean;

    @Prop({ type: Boolean, default: false })
    canChangeChatName?: boolean;

    @Prop({ type: Boolean, default: false })
    canChangeChatAvatar?: boolean;

    @Prop({ type: Boolean, default: false })
    canPinMessages?: boolean;

    @Prop({ type: Boolean, default: false })
    canAddMembers?: boolean;

    @Prop({ type: Boolean, default: false })
    canKickMembers?: boolean;

    @Prop({ type: Boolean, default: false })
    canBanMembers?: boolean;

    @Prop({ type: Boolean, default: false })
    canDeleteMessages?: boolean;

    @Prop({ type: Boolean, default: false })
    canSetRoles?: boolean;

    @Prop({ type: Boolean, default: false })
    canCreateRoles?: boolean;

    @Prop({ type: Date, default: utcDayjs().toDate() })
    createdAt?: Date;

    @Prop({ type: Date, default: utcDayjs().toDate() })
    updatedAt?: Date;

    @Prop({ type: String, default: null })
    softDeleted?: string | null;
}

export const ChatRoleSchema = SchemaFactory.createForClass(ChatRole)
    .index({ chat: 1 })
    .index({ chat: 1, name: 1 })
    .index({ softDeleted: 1 })
    .index({ createdAt: 1 })
    .index({ updatedAt: 1 });
