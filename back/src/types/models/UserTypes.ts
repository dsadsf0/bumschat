export interface UserInterface {
	username: string,
	secretBase32: string,
	recoverySecret: string,
	softDeleted: false,
	createdAt: number,
	authToken: string,
	qrImg: string,
}

export type UserDTOInterface = Pick<UserInterface, 'username'>