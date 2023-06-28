import User from '../models/UserModel'
import { UserInterface, UserDTOInterface } from './../types/models/userModel';


class UserService {
  static userDTO(user: UserInterface): UserDTOInterface {
    if (!user) return null;
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