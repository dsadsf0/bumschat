import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnatchedLogger } from 'src/core/services/snatched-logger/logger.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User, UserSchema } from './user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { QrService } from 'src/core/services/qr-service/qr.service';
import { SpeakeasyService } from 'src/core/services/speakeasy/speakeasy.service';
import { CryptoModule } from '../crypto/crypto.module';
import { AvatarService } from 'src/core/services/avatar-service/avatar.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), CryptoModule],
    controllers: [UserController],
    providers: [UserService, UserRepository, SpeakeasyService, QrService, AvatarService, ConfigService, SnatchedLogger],
    exports: [UserService],
})
export class UserModule {}
