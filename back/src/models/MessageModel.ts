import mongoose from "mongoose";
import { MessageInterface } from "../types/models/MessageTypes";

const Message = new mongoose.Schema<MessageInterface>({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    forwarded: { type: Object, required: false },
    text: { type: String, required: true },
    time: { type: Number, required: true },
})

export default mongoose.model('message', Message);