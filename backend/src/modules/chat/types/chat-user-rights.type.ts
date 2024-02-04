import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Models } from 'src/core/consts/models';

@Schema()
export class ChatUserRights {
    @Prop({ required: true, type: Types.ObjectId, ref: Models.User })
    public user: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: Models.ChatRole })
    public chatRole: Types.ObjectId;
}

export const ChatUserRightsSchema = SchemaFactory.createForClass(ChatUserRights);
