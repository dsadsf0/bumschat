import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedService } from 'src/modules/snatchedLogger/logger.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { Users, UsersSchema } from './user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoService } from 'src/modules/crypto/crypto.service';
import { QrService } from 'src/modules/qr-service/qr.service';
import { SpeakeasyService } from 'src/modules/speakeasy/speakeasy.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }])],
	controllers: [UserController],
	providers: [UserService, UserRepository, SpeakeasyService, ConfigService, SnatchedService, CryptoService, QrService],
})
export class UserModule {}
