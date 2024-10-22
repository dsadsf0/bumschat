import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import UsernameRestrictions from 'src/core/consts/usernameRegexp';

export class UserCheckNameDto {
    @ApiProperty({
        description: 'Username of account',
        example: 'user',
        type: String,
    })
    @IsNotEmpty({ message: 'Need username' })
    @IsString({ message: 'Username should be a string' })
    @Length(UsernameRestrictions.MinLength, UsernameRestrictions.MaxLength, {
        message: 'Username length should be between 3 and 25 characters',
    })
    @Matches(UsernameRestrictions.UsernameRegex, {
        message: 'In username you can use only any Unicode letter character, " ", "-", "_"',
    })
    public username: string;
}
