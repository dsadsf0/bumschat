import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedService } from 'src/modules/snatched-logger/logger.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User, UserSchema } from './user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { QrService } from 'src/modules/qr-service/qr.service';
import { SpeakeasyService } from 'src/modules/speakeasy/speakeasy.service';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), CryptoModule],
	controllers: [UserController],
	providers: [UserService, UserRepository, SpeakeasyService, QrService, ConfigService, SnatchedService],
	exports: [UserService],
})
export class UserModule {}
