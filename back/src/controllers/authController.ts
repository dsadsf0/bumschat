import { NextFunction, Response } from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import bcrypt from 'bcrypt'
import { TypedLoginCheckNameRequestBody, TypedLoginRequestBody, TypedSignupRequestBody } from '../types/express/AuthRequest';

class AuthController {
    static async signup (req: TypedSignupRequestBody, res: Response, next: NextFunction) {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json('No username');
        }

        const user = await userService.getUserByUsername(username)

        if (user) {
            return res.status(400).json('User with this username already exist');
        }

        const secret = speakeasy.generateSecret({
            name: `Bums Chat: ${username}`,
        })
        const recoverySecret = await bcrypt.hash(username + Date.now(), 5);
        const newUser = {
            username,
            secretBase32: secret.base32,
            recoverySecret,
            softDeleted: false,
        }

        await userService.createUser(newUser)

        const qrData = await qrcode.toDataURL(secret.otpauth_url);

        return res.json(qrData);
    }

    static async loginCheck (req: TypedLoginCheckNameRequestBody, res: Response, next: NextFunction) {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json('No username');
        }

        const user = await userService.getUserByUsername(username)

        if (!user) {
            return res.status(401).json('This user does not exist');
        }

        return res.json('ok');
    }

    static async login (req: TypedLoginRequestBody, res: Response, next: NextFunction) {
        console.log('login');

        const { username, verificationCode } = req.body;

        if (!username) {
            return res.status(400).json('No username');
        }

        if (!verificationCode) {
            return res.status(400).json('No 2FA code');
        }

        // const user = await userService.getUserByUsername(username)

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