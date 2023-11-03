import { ApiProperty } from '@nestjs/swagger';

export class UserGetRdo {
	@ApiProperty({
		description: 'Username of account',
		example: 'user',
		type: String,
	})
	public username: string;
}
