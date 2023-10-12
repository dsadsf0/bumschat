import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigSchema } from './app.schema';
import { SnatchedService } from './snatchedLogger/logger.service';
import { UserModule } from './user/user.module';
import { join } from 'path';
import * as Joi from 'joi';
import { CryptoModule } from './crypto/crypto.module';
import { QrModule } from './qr-service/qr.module';
import { QrService } from './qr-service/qr.service';
import { CryptoService } from './crypto/crypto.service';

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
			}),
		}),
		MongooseModule.forRoot(process.env.MONGO_CONNECT, {
			dbName: process.env.MONGO_NAME,
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'QR-codes'),
		}),
		UserModule,
	],
	controllers: [AppController],
	providers: [AppService, CryptoService, QrService, ConfigService, SnatchedService],
})
export class AppModule {}
