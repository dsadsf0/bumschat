import { Reflector } from '@nestjs/core';
import { UserRolesValues } from 'src/core/types/roles.type';

export const UserRolesDecorator = Reflector.createDecorator<UserRolesValues[]>();
