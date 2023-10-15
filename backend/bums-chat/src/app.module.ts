import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigSchema } from './app.schema';
import { SnatchedService } from './snatchedLogger/logger.service';
import { UserModule } from './user/user.module';
import { join, resolve } from 'path';
import * as Joi from 'joi';
import { QR_FOLDER_NAME, QrService } from './qr-service/qr.service';
import { CryptoService } from './crypto/crypto.service';
import Endpoints from './consts/endpoint';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.${process.env.NODE_ENV}.env`,
			validationSchema: Joi.object<AppConfigSchema, true>({
				PORT: Joi.number().required(),
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
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', QR_FOLDER_NAME),
			serveRoot: `/${Endpoints.Global}/${Endpoints.QrCodies}`,
			serveStaticOptions: {
				index: false,
			},
		}),
		UserModule,
	],
	controllers: [AppController],
	providers: [AppService, CryptoService, QrService, ConfigService, SnatchedService],
})
export class AppModule {}
