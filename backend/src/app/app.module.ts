import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigSchema } from './app.schema';
import { SnatchedService } from 'src/modules/snatchedLogger/logger.service';
import { UserModule } from 'src/modules/user/user.module';
import * as Joi from 'joi';
import { QrService } from 'src/modules/qr-service/qr.service';
import { SocketModule } from 'src/modules/socket/socket.module';
import { CryptoModule } from 'src/modules/crypto/crypto.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.${process.env.NODE_ENV}.env`,
			validationSchema: Joi.object<AppConfigSchema, true>({
				PORT: Joi.number().required(),
				SOCKET_PORT: Joi.number().required(),
				MONGO_CONNECT: Joi.string().required(),
				MONGO_NAME: Joi.string().required(),
				CLIENT_URL: Joi.string().required(),
				PASS_SALT_ROUNDS: Joi.number().required(),
				AUTH_TOKEN_SALT_ROUNDS: Joi.number().required(),
				UUID_NAMESPACE: Joi.string().required(),
				PASS_PHRASE: Joi.string().required(),
				GLOBAL_PUBLIC_KEY: Joi.string().required(),
				GLOBAL_PRIVATE_KEY: Joi.string().required(),
			}),
		}),
		MongooseModule.forRoot(process.env.MONGO_CONNECT, {
			dbName: process.env.MONGO_NAME,
		}),
		CryptoModule,
		UserModule,
		SocketModule,
	],
	controllers: [AppController],
	providers: [AppService, QrService, ConfigService, SnatchedService],
})
export class AppModule {}
