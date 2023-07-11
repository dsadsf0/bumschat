import { NextFunction, Response, Request } from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import bcrypt from 'bcrypt';
import { 
	AuthCheckedRequest,
	TypedDeleteRequestParams, 
	TypedLoginCheckNameRequestParams, 
	TypedLoginRequestBody, 
	TypedRecoveryUserRequestBody, 
	TypedSignupRequestBody 
} from '../types/express/AuthRequest';
import UserService from '../services/mongo/UserService';
import { COOKIE_OPTIONS } from '../constants/cookie';
import qrService from '../services/files/qrService';
import shortPassGen from '../utils/shortPassGen';
import { AUTH_TOKEN_SALT_ROUNDS, PASS_SALT_ROUNDS } from '../constants/salts';
import validateUsername from '../utils/validateUsername';

class AuthController {

	static async authTokenCheck(req: AuthCheckedRequest<Request>, res: Response, next: NextFunction) {
		const user = req.user;

		const userDto = UserService.userDTO(user);
		return res.status(200).json(userDto);
	}

	static async signup(req: TypedSignupRequestBody, res: Response, next: NextFunction) {
		try {
			const { username } = req.body;
			if (!username) {
				return res.status(400).json('No username');
			}

			if (!validateUsername(username)) {
				return res.status(400).json('Invalid username');
			}

			const user = await UserService.getUserByUsername(username)
			if (user) {
				return res.status(400).json('This username is taken');
			}

			const secret = speakeasy.generateSecret({
				name: `Bums Chat: ${username}`,
			});

			let authToken = await bcrypt.hash(username, AUTH_TOKEN_SALT_ROUNDS);
			while (await UserService.getUserByAuthToken(authToken)) {
				authToken = await bcrypt.hash(username, AUTH_TOKEN_SALT_ROUNDS);
			}

			const recoveryPass = shortPassGen();
			const recoverySecret = await bcrypt.hash(recoveryPass, PASS_SALT_ROUNDS);
			
			const qrData = await qrcode.toDataURL(secret.otpauth_url);
			const treatedQRData = qrData.replace(/^data:image\/png+;base64,/, '').replace(/ /g, '+');
			const fileName = qrService.createQrImg(treatedQRData);

			const createdAt = Date.now();

			const newUser = await UserService.createUser({
				username,
				secretBase32: secret.base32,
				recoverySecret,
				softDeleted: false,
				createdAt,
				authToken,
				qrImg: fileName,
			});

			res.cookie('authToken', authToken, COOKIE_OPTIONS);

			return res.status(200).json({
				user: newUser, 
				qrImg: fileName,
				recoveryPass,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json('Server Creating User Error');
		}
	}

	static async loginCheck(req: TypedLoginCheckNameRequestParams, res: Response, next: NextFunction) {
		try {
			const { username } = req.params;

			if (!username) {
				return res.status(400).json('No username');
			}

			const user = await UserService.getUserByUsername(username);

			if (!user) {
				return res.status(400).json('This user does not exist');
			}

			return res.status(200).json('ok');
		} catch (error) {
			console.log(error);            
			return res.status(500).json('Server Username Verification Error');
		}
	}

	static async login(req: TypedLoginRequestBody, res: Response, next: NextFunction) {
		try {
			const { username, verificationCode } = req.body;

			if (!username) {
				return res.status(400).json('No username');
			}

			if (!verificationCode) {
				return res.status(400).json('No 2FA code');
			}

			const user = await UserService.getUserByUsername(username);

			if (!user) {
				return res.status(400).json('This user does not exist');
			}

			const isCorrectToken = speakeasy.totp.verify({
				secret: user.secretBase32,
				encoding: 'base32',
				token: verificationCode
			});

			if (!isCorrectToken) {
				return res.status(400).json('Not correct 2FA code');
			}

			res.cookie('authToken', user.authToken, COOKIE_OPTIONS);

			const userDto = UserService.userDTO(user);

			return res.status(200).json(userDto);
		} catch (error) {
			console.log(error);            
			return res.status(500).json('Server Login Error');
		}
	}

	static async logout(req: AuthCheckedRequest<Request>, res: Response, next: NextFunction) {
		try {
			res.clearCookie('authToken', COOKIE_OPTIONS);

			return res.status(200).json('ok');
		} catch (error) {
			console.log(error);
			return res.status(500).json('Server Logout Error');
		}
	}

	static async deleteUser(req: AuthCheckedRequest<TypedDeleteRequestParams>, res: Response, next: NextFunction) {
		try {
			const user = req.user;
			await UserService.softDeleteUser(user.username);

			return res.status(200).json('ok');
		} catch (error) {
			console.log(error);
			return res.status(500).json('Server Error');
		}
	}

	static async recoveryUser(req: TypedRecoveryUserRequestBody, res: Response, next: NextFunction) {
		try {
			const {username, recoveryPass} = req.body;

			if (!username) {
				return res.status(400).json('No username');
			}

			if (!recoveryPass) {
				return res.status(400).json('No recoveryPass');
			}

			const user = await UserService.getUserByUsername(username)
			if (!user) {
				return res.status(400).json('This user does not exist');
			}

			const isCorrectPass = await bcrypt.compare(recoveryPass, user.recoverySecret);

			if (!isCorrectPass) {
				return res.status(400).json('Invalid recovery password');
			}

			res.cookie('authToken', user.authToken, COOKIE_OPTIONS);

			return res.status(200).json({
				user: UserService.userDTO(user), 
				qrImg: user.qrImg,
				recoveryPass,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json('Server Recovery Error');
		}
	}
}

export default AuthController;