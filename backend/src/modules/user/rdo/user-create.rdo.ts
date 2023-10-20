import { ApiProperty } from '@nestjs/swagger';

export class UserCreateRdo {
	@ApiProperty({
		description: 'Username of account',
		example: 'user',
		type: String,
	})
	public username: string;

	@ApiProperty({
		description: 'Name of QR image file to set 2FA',
		example: 'user_28fd0f81-79ea-4069-8953-fda221e9d564.png',
		type: String,
	})
	public qrImg: string;

	@ApiProperty({
		description: 'Secret password (encrypted by clientPublicKey), that would be necessary to recover account if you lost 2FA or delete your account',
		example: '$wfk22sd234jfk3467$3r6sdf67sd67f783$/rt734',
		type: String,
	})
	public recoverySecret: string;
}
