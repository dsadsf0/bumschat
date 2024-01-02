import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRolesValues } from 'src/core/consts/roles';
import { DocumentModel } from 'src/core/types/document-model.type';
import utcDayjs from 'src/core/utils/utcDayjs';

export type UserDocument = DocumentModel<User>;

@Schema({ timestamps: { updatedAt: true, createdAt: false } })
export class User {
	@Prop({ type: String, required: true, unique: true })
	username: string;

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

	@Prop({ type: String, default: 'user' })
	role?: UserRolesValues;
}

export const UserSchema = SchemaFactory.createForClass(User).index({ username: 1 }).index({ authToken: 1 });
