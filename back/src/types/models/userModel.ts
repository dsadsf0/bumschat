export interface UserInterface {
    username: string,
    // secret from speakeasy to verify code from authentificator
    secretBase32: string,
    // secret key to recovery account generating from usernanme + createdAt
    recoverySecret: string,
    softDeleted: false,
    // to hash recoverySecret
    createdAt: number,
    // token to keep authorized
    authToken: string,
    // img with qr code
    qrImg: string
}

export type UserDTOInterface = Pick<UserInterface, 'username'>