import mongoose from "mongoose";
import { UserInterface } from "../types/models/UserTypes";

const User = new mongoose.Schema<UserInterface>({
	username: { type: String, required: true, unique: true },
	secretBase32: { type: String, required: true },
	recoverySecret: { type: String, required: true },
	authToken: { type: String, required: true },
	qrImg: { type: String, required: true },
	createdAt: { type: Number, required: true },
	softDeleted: { type: Boolean, required: true },
})

export default mongoose.model('user', User)