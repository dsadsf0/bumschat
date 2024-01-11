export const UserRoles = {
	User: 'user',
	Admin: 'admin',
	Creator: 'creator',
} as const;

export type UserRolesType = typeof UserRoles;
export type UserRolesKeys = keyof UserRolesType;
export type UserRolesValues = UserRolesType[UserRolesKeys];

export const DEFAULT_CHAT_ROLE_NAME = 'user';
