import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Models } from 'src/core/consts/models';

export class ChatUserRights {
	@Prop({ required: true, type: Types.ObjectId, ref: Models.User })
	user: Types.ObjectId;

	@Prop({ required: true, type: Types.ObjectId, ref: Models.ChatRole })
	chatRole: Types.ObjectId;
}
