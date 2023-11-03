import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { UserRolesValues } from 'src/core/consts/roles';

@Schema()
export class User {
	@Prop({ type: String, required: true, unique: true })
	@IsNotEmpty({ message: 'Need username' })
	@IsString({ message: 'Username should be a string' })
	@Length(3, 25, { message: 'Username length should be between 3 and 25 characters' })
	username: string;

	@Prop({ type: String, required: true })
	@IsNotEmpty({ message: 'Need secretBase32' })
	@IsString({ message: 'SecretBase32 should be a string' })
	secretBase32: string;

	@Prop({ type: String, required: true })
	@IsNotEmpty({ message: 'Need recoverySecret' })
	@IsString({ message: 'RecoverySecret should be a string' })
	recoverySecret: string;

	@Prop({ type: String, required: true })
	@IsNotEmpty({ message: 'Need authToken' })
	@IsString({ message: 'AuthToken should be a string' })
	authToken: string;

	@Prop({ type: String, required: true })
	@IsNotEmpty({ message: 'Need qrImg' })
	@IsString({ message: 'QrImg should be a string path to qrImg' })
	qrImg: string;

	@Prop({ type: String, required: true })
	@IsNotEmpty({ message: 'Need createdAt' })
	@IsString({ message: 'CreatedAt should be a string' })
	createdAt: string;

	@Prop({ type: String, required: false, default: null })
	@IsNotEmpty({ message: 'Need softDeleted' })
	@IsString({ message: 'SoftDeleted should be a string' })
	softDeleted: string | null;

	@Prop({ type: String, required: false, default: 'user' })
	role: UserRolesValues;
}

export const UserSchema = SchemaFactory.createForClass(User);
