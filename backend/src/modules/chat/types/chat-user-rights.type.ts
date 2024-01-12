import { Types } from 'mongoose';

// @Schema()
export type ChatUserRights = {
	// @Prop({ required: true, type: Types.ObjectId, ref: Models.User })
	user: Types.ObjectId;

	// @Prop({ required: true, type: Types.ObjectId, ref: Models.ChatRole })
	chatRole: Types.ObjectId;
};
