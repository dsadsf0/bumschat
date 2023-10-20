import { Body, Controller, Get, Post, Res, Req, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import Endpoints from 'src/core/consts/endpoint';
import { UserCreateDto } from './dto/user-create.dto';
import { UserCreateRdo } from './rdo/user-create.rdo';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthCheckedRequest } from './types/authCheckedTypes';
import { UserGetRdo } from './rdo/user-get.rdo';
import { AuthGuard } from './guards/auth.guard';
import { resolve } from 'path';
import { QR_FOLDER_NAME } from 'src/modules/qr-service/qr.service';
import { UserLoginDto } from './dto/user-login.dto';
import { Delete } from '@nestjs/common/decorators/http';
import { UserRecoveryDto } from './dto/user-recovery.dto';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiHeader,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserCheckNameDto } from './dto/user-chek-username.dto';
import { UserRolesDecorator } from './decorators/roles.decorator';
import { UserRoles } from './../../core/consts/roles';
import { UserRoleGuard } from './guards/role.guard';

@ApiTags('Users module')
@Controller(Endpoints.User.Root)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: 'Registration(creating) new user' })
	@ApiCreatedResponse({ description: 'New user registered', type: UserCreateRdo })
	@ApiBadRequestResponse({ description: 'Username is taken' })
	@Post()
	@HttpCode(HttpStatus.CREATED)
	public async signUp(@Body() userDto: UserCreateDto, @Res({ passthrough: true }) response: Response): Promise<UserCreateRdo> {
		return await this.userService.signUp(userDto, response);
	}

	@ApiOperation({ summary: 'Checking is username taken' })
	@ApiOkResponse({ description: 'Return true if user exist, else return false', type: Boolean })
	@Post(Endpoints.User.Login.UsernameCheck)
	@HttpCode(HttpStatus.OK)
	public async loginUsernameCheck(@Body() userDto: UserCheckNameDto): Promise<boolean> {
		return await this.userService.checkUsername(userDto);
	}

	@ApiOperation({ summary: 'Login endpoint' })
	@ApiOkResponse({ description: 'User logged in', type: UserGetRdo })
	@ApiNotFoundResponse({ description: 'User does not exist' })
	@ApiUnauthorizedResponse({ description: 'Does not correct 2FA code' })
	@Post(Endpoints.User.Login.Root)
	@HttpCode(HttpStatus.OK)
	public async login(@Body() userDto: UserLoginDto, @Res({ passthrough: true }) response: Response): Promise<UserGetRdo> {
		return await this.userService.login(userDto, response);
	}

	@ApiOperation({ summary: 'Getting authed user short data' })
	@ApiHeader({
		name: 'authToken',
		description: 'Authorization token',
	})
	@ApiOkResponse({ description: 'User data', type: UserGetRdo })
	@ApiUnauthorizedResponse({ description: 'Unauthorized. No auth token or invalid token' })
	@Get()
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	public getAuthedUser(@Req() request: AuthCheckedRequest): UserGetRdo {
		return request.user;
	}

	@ApiOperation({ summary: 'Logout endpoint' })
	@ApiHeader({
		name: 'authToken',
		description: 'Authorization token',
	})
	@ApiOkResponse({ description: 'User logged out' })
	@ApiUnauthorizedResponse({ description: 'Unauthorized. No auth token or invalid token' })
	@Get(Endpoints.User.Logout)
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	public async logout(@Req() request: AuthCheckedRequest, @Res({ passthrough: true }) response: Response): Promise<void> {
		return await this.userService.logout(request, response);
	}

	@ApiOperation({
		summary: 'Soft deleting user',
		description: 'User can delete his own account. Account will become not available, but username will still be taken',
	})
	@ApiHeader({
		name: 'authToken',
		description: 'Authorization token',
	})
	@ApiNoContentResponse({ description: 'User has been soft deleted' })
	@ApiUnauthorizedResponse({ description: 'Unauthorized. No auth token or invalid token' })
	@Delete()
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(AuthGuard)
	public async softDelete(@Req() request: AuthCheckedRequest, @Res({ passthrough: true }) response: Response): Promise<void> {
		return await this.userService.softDelete(request, response);
	}

	@ApiOperation({ summary: 'Recover soft deleted user' })
	@ApiOkResponse({ description: 'User has been recovery from soft deleted', type: UserCreateRdo })
	@ApiNotFoundResponse({ description: 'User with this username does not exist' })
	@ApiBadRequestResponse({ description: 'Invalid recovery secret' })
	@Post(Endpoints.User.Recovery)
	@HttpCode(HttpStatus.OK)
	public async recoverySoftDeleted(userDto: UserRecoveryDto, @Res({ passthrough: true }) response: Response): Promise<UserCreateRdo> {
		return await this.userService.recoverSoftDeleted(userDto, response);
	}

	@ApiOperation({ summary: 'Return public key' })
	@ApiOkResponse({ description: 'Global public key to encrypt data', type: String })
	@Get(Endpoints.User.GlobalKey)
	@HttpCode(HttpStatus.OK)
	public getGlobalPublicKey(): string {
		return this.userService.getGlobalPublicKey();
	}

	@ApiOperation({ summary: 'COMPLETELY delete user' })
	@ApiHeader({
		name: 'authToken',
		description: 'Authorization token',
	})
	@ApiNoContentResponse({ description: 'User completely deleted' })
	@ApiUnauthorizedResponse({ description: 'Unauthorized. No auth token or invalid token' })
	@ApiForbiddenResponse({ description: 'Forbidden. Not enough permissions, to delete user' })
	@Delete(`${Endpoints.User.Delete}/:username`)
	@UserRolesDecorator([UserRoles.Creator, UserRoles.Admin])
	@UseGuards(AuthGuard, UserRoleGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	public async deleteUser(@Param('username') username: string, @Req() request: AuthCheckedRequest): Promise<void> {
		await this.userService.delete(request, username);
	}

	@ApiOperation({ summary: 'Return QR code image' })
	@ApiHeader({
		name: 'authToken',
		description: 'Authorization token',
	})
	@ApiOkResponse({ description: 'Qr code image' })
	@ApiUnauthorizedResponse({ description: 'Unauthorized. No auth token or invalid token' })
	@ApiNotFoundResponse({ description: 'User with this username does not exist' })
	@Get(Endpoints.User.Qr)
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	public async getQrImg(@Res() response: Response, @Req() request: AuthCheckedRequest): Promise<void> {
		const qrImg = await this.userService.getQrImg(request.user.username);
		response.sendFile(resolve(QR_FOLDER_NAME, qrImg));
	}
}
