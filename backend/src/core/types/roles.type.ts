import { UserRoles } from '../consts/roles';

export type UserRolesType = typeof UserRoles;
export type UserRolesKeys = keyof UserRolesType;
export type UserRolesValues = UserRolesType[UserRolesKeys];
