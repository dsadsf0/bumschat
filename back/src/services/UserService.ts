import User from '../models/UserModel'
import { UserInterface } from './../types/models/userModel';

class UserService {
  static async createUser(user: UserInterface): Promise<Pick<UserInterface, 'username' | 'qrImg' | 'recoverySecret'>| null> {
    try {
      const newUser = await User.create(user);
      return {
        username: newUser.username, 
        qrImg: newUser.qrImg, 
        recoverySecret: newUser.recoverySecret
      } || null;
    } catch (error) {
      console.log(error);
      return null
    }
  }

  static async getUserByUsername(username: string): Promise<UserInterface | null> {
    try {
      const user = await User.findOne({username}).lean();
      return user || null;
    } catch (error) {
      console.log(error);
      return null
    }
  }

}

export default UserService