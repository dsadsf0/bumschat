

export interface UserInterface {
    username: string,
    secretBase32: string,
    recoverySecret: string,
    softDeleted: boolean,
}