import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class RequestAuthTokenDto {
	@ApiProperty({
		description: 'Client public key to encrypting data',
		example: '-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqwEAAQ==\n-----END PUBLIC KEY-----',
		type: String,
	})
	@IsNotEmpty({ message: 'Need clientPublicKey' })
	@IsString({ message: 'clientPublicKey should be a string' })
	public clientPublicKey: string;
}
