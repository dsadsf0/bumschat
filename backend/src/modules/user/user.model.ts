import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Models } from 'src/core/consts/models';
import { DocumentModel } from 'src/core/types/document-model.type';
import { UserRolesValues } from 'src/core/types/roles.type';
import utcDayjs from 'src/core/utils/utcDayjs';

export type UserDocument = DocumentModel<User>;

@Schema()
export class User {
	@Prop({ type: String, required: true, unique: true })
	username: string;

	@Prop({ type: String, required: true })
	avatar: string;

	@Prop({ type: String, default: 'user' })
	role?: UserRolesValues;

	@Prop({ type: [Types.ObjectId], default: [], ref: Models.Chat })
	chats: Types.ObjectId[];

	@Prop({ type: String, required: true })
	secretBase32: string;

	@Prop({ type: String, required: true })
	recoverySecret: string;

	@Prop({ type: String, required: true })
	authToken: string;

	@Prop({ type: String, required: true })
	qrImg: string;

	@Prop({ type: Date, default: utcDayjs().toDate() })
	createdAt?: Date;

	@Prop({ type: Date, default: utcDayjs().toDate() })
	updatedAt?: Date;

	@Prop({ type: String, default: null })
	softDeleted?: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User)
	.index({ username: 1 })
	.index({ authToken: 1 })
	.index({ softDeleted: 1 })
	.index({ createdAt: 1 })
	.index({ updatedAt: 1 });
