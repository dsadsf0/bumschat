import { ApiProperty } from '@nestjs/swagger';

export class UserGetRdo {
    @ApiProperty({
        description: 'User id',
        example: '6571e0e5264146b51067dc32',
        type: String,
    })
    public id: string;

    @ApiProperty({
        description: 'Username of account',
        example: 'user',
        type: String,
    })
    public username: string;

    @ApiProperty({
        description: 'Username of account',
        example: ['3971b0e5568136a50063fc11'],
        type: [String],
    })
    public chats: string[];
}
