import User from '../models/UserModel';
import { UserInterface, UserDTOInterface } from './../types/models/userModel';
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel';


class UserService {
	static userDTO(user: UserInterface): UserDTOInterface {
		if (!user) {
			return null;
		}

		const dtoUser = {
			username: user.username, 
		};
		
		return dtoUser || null;
	}

	static async createUser(user: UserInterface): Promise<UserDTOInterface | null> {
		try {
			const newUser = await User.create(user);
			return this.userDTO(newUser);
		} catch (error) {
		console.log(error);
			return null;
		}
	}

	static async getUserByUsername(username: string): Promise<UserInterface | null> {
		try {
			const user = await User.findOne({username}).lean();
			return user || null;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	static async getUserByAuthToken(token: string): Promise<UserInterface | null> {
		try {
			const user = await User.findOne({authToken: token}).lean();
			return user || null;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	static async validateAuthToken(token: string, username: string): Promise<boolean> {
		try {
			return await bcrypt.compare(username, token);
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	static async softDeleteUser(username: string): Promise<void> {
		try {
			await UserModel.updateOne({username}, {
				$set: { softDeleted: true }
			});
		} catch (error) {
			console.log(error);
		}
	}

	static async recoverySoftDeletedUser(username: string): Promise<void> {
		try {
			await UserModel.updateOne({username}, {
				$set: { softDeleted: false }
			});
		} catch (error) {
			console.log(error);
		}
	}
}

export default UserService