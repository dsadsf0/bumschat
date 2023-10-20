import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UserCheckNameDto {
	@ApiProperty({
		description: 'Username of account',
		example: 'user',
		type: String,
	})
	@IsNotEmpty({ message: 'Need username' })
	@IsString({ message: 'Username should be a string' })
	@Length(3, 25, { message: 'Username length should be between 3 and 25 characters' })
	public username: string;
}
