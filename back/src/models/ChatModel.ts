import mongoose from "mongoose";
import { ChatInterface } from "../types/models/ChatTypes";

const Chat = new mongoose.Schema<ChatInterface>({
    name: { type: String, required: true },
    type: { type: String, required: true },
    users: [{ type: String, required: true }],
})

export default mongoose.model('chat', Chat);