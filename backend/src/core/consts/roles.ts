export const UserRoles = {
	User: 'user',
	Admin: 'admin',
	Creator: 'creator',
} as const;

export type UserRolesType = typeof UserRoles;
export type UserRolesKeys = keyof UserRolesType;
export type UserRolesValues = UserRolesType[UserRolesKeys];
