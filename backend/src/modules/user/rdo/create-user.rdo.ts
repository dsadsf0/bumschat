import { ApiProperty } from '@nestjs/swagger';
import { UserGetRdo } from './get-user.rdo';

export class UserCreateRdo {
	@ApiProperty({
		description: 'User object',
		example: { username: 'user' },
		type: UserGetRdo,
	})
	public user: UserGetRdo;

	@ApiProperty({
		description: 'Secret password (encrypted by clientPublicKey), that would be necessary to recover account if you lost 2FA or delete your account',
		example: '$wfk22sd234jfk3467$3r6sdf67sd67f783$/rt734',
		type: String,
	})
	public recoverySecret: string;
}
