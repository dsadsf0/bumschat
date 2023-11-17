import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UserRecoveryDto {
	@ApiProperty({
		description: 'Username of account',
		example: 'user',
		type: String,
	})
	@IsNotEmpty({ message: 'Need username' })
	@IsString({ message: 'Username should be a string' })
	@Length(3, 25, { message: 'Username length should be between 3 and 25 characters' })
	@Matches(/^[\p{L}\p{M}A-Za-z \d_-]+$/g, { message: 'In username you can use only any Unicode letter character, " ", "-", "_"' })
	public username: string;

	@ApiProperty({
		description: 'Secret password (encrypted by serverPublicKey), that would be necessary to recover account if you lost 2FA or delete your account',
		example: '$wfk22sd234jfk3467$3r6sdf67sd67f783$/rt734',
		type: String,
	})
	@IsNotEmpty({ message: 'Need recoverySecret' })
	@IsString({ message: 'recoverySecret should be a string' })
	public recoverySecret: string;
}
