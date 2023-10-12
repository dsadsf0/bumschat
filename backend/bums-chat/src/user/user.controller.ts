import { Body, Controller, Get, Post, Res, Req } from '@nestjs/common';
import Endpoints from 'src/consts/endpoint';
import { UserCreateDto } from './dto/user-create.dto';
import { UserCreateRdo } from './rdo/user-create.rdo';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller(Endpoints.User.Root)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	public async signUp(@Body() userDto: UserCreateDto, @Res({ passthrough: true }) response: Response): Promise<UserCreateRdo> {
		return await this.userService.signUp(userDto, response);
	}
}
