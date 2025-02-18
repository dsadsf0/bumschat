import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import UsernameRestrictions from 'src/core/consts/usernameRegexp';

export class UserCreateDto {
    @ApiProperty({
        description: 'Username of account',
        example: 'user',
        type: String,
    })
    @IsNotEmpty({ message: 'Need username' })
    @IsString({ message: 'Username should be a string' })
    @Transform(({ value }) => value.trim())
    @Length(UsernameRestrictions.MinLength, UsernameRestrictions.MaxLength, {
        message: 'Username length should be between 3 and 25 characters',
    })
    @Matches(UsernameRestrictions.UsernameRegex, {
        message: 'In username you can use only any Unicode letter character, " ", "-", "_"',
    })
    public username: string;

    @ApiProperty({
        description: 'Client public key to encrypting data',
        example: '-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqwEAAQ==\n-----END PUBLIC KEY-----',
        type: String,
    })
    @IsNotEmpty({ message: 'Need clientPublicKey' })
    @IsString({ message: 'clientPublicKey should be a string' })
    public clientPublicKey: string;
}
