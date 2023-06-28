import { NextFunction, Response, Request } from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import bcrypt from 'bcrypt';
import { 
	TypedDeleteRequestParams, 
	TypedLoginCheckNameRequestParams, 
	TypedLoginRequestBody, 
	TypedSignupRequestBody 
} from '../types/express/AuthRequest';
import UserService from '../services/UserService';
import COOKIE_LIFE_TIME from '../constants/cookie';
import qrService from '../fileServices/qrService';
import shortPassGen from '../utils/shortPassGen';
import { AUTH_TOKEN_SALT_ROUNDS, PASS_SALT_ROUNDS } from '../constants/salts';

class AuthController {

	static async signup(req: TypedSignupRequestBody, res: Response, next: NextFunction) {
		try {
			const { username } = req.body;
			if (!username) {
				return res.status(400).json('No username');
			}

			const user = await UserService.getUserByUsername(username)
			if (user) {
				return res.status(400).json('User with this username already exist');
			}

			const secret = speakeasy.generateSecret({
				name: `Bums Chat: ${username}`,
			})

			const authToken = await bcrypt.hash(username, AUTH_TOKEN_SALT_ROUNDS);

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

			res.cookie('authToken', authToken, { maxAge: COOKIE_LIFE_TIME, httpOnly: true, secure: false, sameSite: 'lax' });

			return res.status(200).json({
				user: newUser, 
				qrImg: fileName,
				recoveryPass,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json('Server creating user Error');
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
				return res.status(401).json('This user does not exist');
			}

			return res.status(200).json('ok');
		} catch (error) {
			console.log(error);            
			return res.status(500).json('Server username verification Error');
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

			const user = await UserService.getUserByUsername(username)

			if (!user) {
				return res.status(401).json('This user does not exist');
			}

			const isCorrectToken = speakeasy.totp.verify({
				secret: user.secretBase32,
				encoding: 'base32',
				token: verificationCode
			})

			if (!isCorrectToken) {
				return res.status(401).json('Not correct 2FA code');
			}

			res.cookie('authToken', user.authToken, { maxAge: COOKIE_LIFE_TIME, httpOnly: true, secure: false, sameSite: 'lax' });

			const userDto = UserService.userDTO(user);

			return res.status(200).json(userDto);
		} catch (error) {
			console.log(error);            
			return res.status(500).json('Server Error');
		}
	}

	static async logout(req: Request, res: Response, next: NextFunction) {
		try {
			res.clearCookie('authToken');

			return res.status(200).json('ok');
		} catch (error) {
			console.log(error);
			return res.status(500).json('Server Error');
		}
	}

	static async deleteUser(req: TypedDeleteRequestParams, res: Response, next: NextFunction) {
		try {
			const username = req.params.username;

			await UserService.softDeleteUser(username);

			return res.status(200).json('ok');
		} catch (error) {
			console.log(error);
			return res.status(500).json('Server Error');
		}
	}
}

export default AuthController