import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UserCheckNameDto {
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
}
