import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigSchema } from './app.schema';
import { SnatchedService } from 'src/modules/snatched-logger/logger.service';
import { UserModule } from 'src/modules/user/user.module';
import * as Joi from 'joi';
import { QrService } from 'src/modules/qr-service/qr.service';
import { SocketModule } from 'src/modules/socket/socket.module';
import { CryptoModule } from 'src/modules/crypto/crypto.module';
import { ChatModule } from 'src/modules/chat/chat.module';
import { ChatMessageModule } from 'src/modules/chat-message/chat-message.module';
import { RealTimeChatModule } from 'src/modules/chat-message/modules/real-time-chat/real-time-chat.module';
import { ChatRoleModule } from 'src/modules/chat-role/chat-role.module';
import { AvatarService } from 'src/modules/avatar-service/avatar.service';
import axios from 'axios';

axios.get('https://cataas.com/cat?type=square&position=centre').then((res) => console.log(res.data));
// решить конфликты

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.${process.env.NODE_ENV}.env`,
			validationSchema: Joi.object<AppConfigSchema, true>({
				PORT: Joi.number(),
				SOCKET_PORT: Joi.number(),
				MONGO_CONNECT: Joi.string(),
				MONGO_NAME: Joi.string(),
				CLIENT_URL: Joi.string(),
				PASS_SALT_ROUNDS: Joi.number(),
				AUTH_TOKEN_SALT_ROUNDS: Joi.number(),
				UUID_NAMESPACE: Joi.string(),
				GLOBAL_PUBLIC_KEY: Joi.string(),
				GLOBAL_PRIVATE_KEY: Joi.string(),
			}),
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService<AppConfigSchema>) => ({
				uri: configService.get('MONGO_CONNECT'),
				dbName: configService.get('MONGO_NAME'),
			}),
			inject: [ConfigService],
		}),
		CryptoModule,
		UserModule,
		SocketModule,
		ChatRoleModule,
		ChatModule,
		RealTimeChatModule,
		ChatMessageModule,
	],
	controllers: [AppController],
	providers: [AppService, QrService, AvatarService, ConfigService, SnatchedService],
})
export class AppModule {}
