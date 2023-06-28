
import UserService from './../services/UserService';
import { NextFunction, Response, } from 'express';
import { TypedRequestParams } from '../types/express/CustomExpress';

class AuthMiddleware {
	static async authTokenCheck (req: TypedRequestParams<{ username: string }>, res: Response, next: NextFunction) {
		try {

			const username = req.params.username;
			if (!username) {
				return res.status(400).json('No username');
			}

			const { authToken } = req.cookies;
			if (!authToken) {
				return next(res.status(400).json('No auth Token or invalid Token'));
			}

			const user = await UserService.getUserByAuthToken(authToken);
			if (user.username !== username) {
				return next(res.status(401).json('Invalid username'));
			}

			const isTokenAndUsernameValid = await UserService.validateAuthToken(authToken, username);
			if (!user || !isTokenAndUsernameValid) {
				return next(res.status(401).json('Invalid token'));
			}

			next();
		} catch (error) {
			return next(res.status(500).json('User not authorized server error'));
		}
	}
}

export default AuthMiddleware