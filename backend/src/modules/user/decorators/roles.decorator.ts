import { Reflector } from '@nestjs/core';
import { UserRolesValues } from './../../../core/consts/roles';

export const UserRolesDecorator = Reflector.createDecorator<UserRolesValues[]>();
