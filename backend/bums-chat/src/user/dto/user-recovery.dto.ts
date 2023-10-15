import { IsNotEmpty, IsString, Length } from 'class-validator';


export class UserRecoveryDto {
	@IsNotEmpty({ message: 'Need username' })
    @IsString({ message: 'Username should be a string' })
	@Length(3, 25, { message: 'Username length should be between 3 and 25 characters' })
	public username: string;

	@IsNotEmpty({ message: 'Need clientPublicKey' })
    @IsString({ message: 'clientPublicKey should be a string' })
	public recoverySecret: string;

	@IsNotEmpty({ message: 'Need clientPublicKey' })
    @IsString({ message: 'clientPublicKey should be a string' })
	public clientPublicKey: string;
}