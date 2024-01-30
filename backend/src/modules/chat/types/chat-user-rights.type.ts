import { Types } from 'mongoose';

// @Schema()
export class ChatUserRights {
    // @Prop({ required: true, type: Types.ObjectId, ref: Models.User })
    public user: Types.ObjectId;

    // @Prop({ required: true, type: Types.ObjectId, ref: Models.ChatRole })
    public chatRole: Types.ObjectId;
}
