import { NextFunction, Response } from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

class AuthController {
    static async signup (req, res: Response, next: NextFunction) {
        console.log('signup');
        const { username } = req.body;
        if (!username) {
            return res.status(400).json('No username');
        }

        const secret = speakeasy.generateSecret({
            name: 'Bums Chat',
        })

        //const user = await usersService.getUserByUsername(username)

        if (user) {
            return res.status(400).json('User with this username already exist');
        }
        // await userService.createUser(username, secret.base32)

        const qrData = await qrcode.toDataURL(secret.otpauth_url)
        console.log(secret);
        console.log(qrData);

        return res.json('ok');
    }

    static async login (req, res: Response, next: NextFunction) {
        console.log('login');

        const {username, verificationCode} = req.body;

        if (!username) {
            return res.status(400).json('No username');
        }

        if (!verificationCode) {
            return res.status(400).json('No 2FA code');
        }

        //const user = await usersService.getUserByUsername(username)

        const user = {
            secretBase32: 'PVHDUNSLOZEE4JKDFESV2QDMJQ6GS3KAGVREOVTNHYXGCLDPOU3A'
        }

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
    }
}

export default AuthController