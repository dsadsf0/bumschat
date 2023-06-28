
import UserService from './../services/UserService';
import { NextFunction, Response, Request } from 'express';
import { UserInterface } from './../types/models/userModel';

class AuthMiddleware {
	static async authCheck(req: Request & {user: UserInterface}, res: Response, next: NextFunction) {
		try {
			const { authToken } = req.cookies;
			if (!authToken) {
				return res.status(401).json('Unauthorized. No auth Token');
			}

			const user = await UserService.getUserByAuthToken(authToken);

			if (!user) {
				return res.status(401).json('Unauthorized. Invalid token');
			}

			req.user = user;
			next();
		} catch (error) {
			return res.status(500).json('User not authorized server error');
		}
	}
}

export default AuthMiddleware