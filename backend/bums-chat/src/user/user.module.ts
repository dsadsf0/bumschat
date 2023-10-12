import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedService } from 'src/snatchedLogger/logger.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { Users, UsersSchema } from './user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoService } from 'src/crypto/crypto.service';
import { QrService } from 'src/qr-service/qr.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }])],
	controllers: [UserController],
	providers: [UserService, UserRepository, CryptoService, QrService, ConfigService, SnatchedService],
})
export class UserModule {}
