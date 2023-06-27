import { NextFunction, Response } from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import bcrypt from 'bcrypt';
import { 
    TypedDeleteRequestBody, 
    TypedLoginCheckNameRequestParams, 
    TypedLoginRequestBody, 
    TypedSignupRequestBody 
} from '../types/express/AuthRequest';
import UserService from '../services/UserService';
import COOKIE_LIFE_TIME from '../constants/cookie';
import qrService from '../fileServices/qrService';
import shortPassGen from '../utils/shortPassGen';
import { AUTH_TOKEN_SALT, PASS_SALT } from '../constants/salts';

class AuthController {
    static async signup (req: TypedSignupRequestBody, res: Response, next: NextFunction) {
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

            const createdAt = Date.now();

            // возвращать recoveryPass как секретный ключ который пользователь должен запомнить
            const recoveryPass = shortPassGen();
            const recoverySecret = await bcrypt.hash(recoveryPass, PASS_SALT);

            const qrData = await qrcode.toDataURL(secret.otpauth_url);

            // token что бы не вылитало с аккаунта
            const authToken = await bcrypt.hash(username, AUTH_TOKEN_SALT);

            const treatedQRData = qrData.replace(/^data:image\/png+;base64,/, "").replace(/ /g, '+');
            const fileName = qrService.createQrImg(treatedQRData)

            const newUser = await UserService.createUser({
                username,
                secretBase32: secret.base32,
                recoverySecret,
                softDeleted: false,
                createdAt,
                authToken,
                qrImg: fileName
            });

            // secure: true means https only
            res.cookie('authToken', authToken, { maxAge: COOKIE_LIFE_TIME, httpOnly: true, secure: true, sameSite: 'strict' })
            return res.json(newUser);
        } catch (error) {
            console.log(error);
            return res.status(500).json('Server Error');
        }
    }

    static async loginCheck(req: TypedLoginCheckNameRequestParams, res: Response, next: NextFunction) {
        try {
            const { username } = req.params;

            if (!username) {
                return res.status(400).json('No username');
            }

            const user = await UserService.getUserByUsername(username)

            if (!user) {
                return res.status(401).json('This user does not exist');
            }

            return res.json('ok');
        } catch (error) {
            console.log(error);            
            return res.status(500).json('Server Error');
        }
    }

    static async login (req: TypedLoginRequestBody, res: Response, next: NextFunction) {
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

            return res.json('ok');
        } catch (error) {
            console.log(error);            
            return res.status(500).json('Server Error');
        }
    }

    static async deleteUser(req: TypedDeleteRequestBody, res: Response, next: NextFunction) {
        try {

            // написать мидлваре для проверки ауф токена
            // и если он верный доставать из бд юзера 
            // и закидывать в реквест закидывать 
            // const { } = req.user;

            //get authTiken from cookie
            // await UserService.deleteUser()
            // qrService.deleteQrImg()


            return res.json('ok');
        } catch (error) {
            console.log(error);
            return res.status(500).json('Server Error');
        }
    }
}

export default AuthController