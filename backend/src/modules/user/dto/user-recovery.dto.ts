import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UserRecoveryDto {
	@ApiProperty({
		description: 'Username of account',
		example: 'user',
		type: String,
	})
	@IsNotEmpty({ message: 'Need username' })
	@IsString({ message: 'Username should be a string' })
	@Length(3, 25, { message: 'Username length should be between 3 and 25 characters' })
	public username: string;

	@ApiProperty({
		description: 'Secret password (encrypted by serverPublicKey), that would be necessary to recover account if you lost 2FA or delete your account',
		example: '$wfk22sd234jfk3467$3r6sdf67sd67f783$/rt734',
		type: String,
	})
	@IsNotEmpty({ message: 'Need recoverySecret' })
	@IsString({ message: 'recoverySecret should be a string' })
	public recoverySecret: string;

	@ApiProperty({
		description: 'Client public key to encrypting data',
		example: '-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqwEAAQ==\n-----END PUBLIC KEY-----',
		type: String,
	})
	@IsNotEmpty({ message: 'Need clientPublicKey' })
	@IsString({ message: 'clientPublicKey should be a string' })
	public clientPublicKey: string;
}
