import { Body, Controller, Get, Post, Res, Req, UseGuards } from '@nestjs/common';
import Endpoints from 'src/consts/endpoint';
import { UserCreateDto } from './dto/user-create.dto';
import { UserCreateRdo } from './rdo/user-create.rdo';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthCheckedRequest } from './types/authCheckedTypes';
import { UserGetRdo } from './rdo/user-get.rdo';
import { AuthGuard } from './guards/auth.guard';

@Controller(Endpoints.User.Root)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	public async signUp(@Body() userDto: UserCreateDto, @Res({ passthrough: true }) response: Response): Promise<UserCreateRdo> {
		return await this.userService.signUp(userDto, response);
	}

	@Get()
	@UseGuards(AuthGuard)
	public getAuthedUser(@Req() request: AuthCheckedRequest): UserGetRdo {
		return request.user;
	}
}
