import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SnatchedService } from './snatchedLogger/logger.service';
import * as cookieParser from 'cookie-parser';
import Endpoints from 'src/consts/endpoint';

async function bootstrap() {
	const PORT = process.env.PORT || 2001;

	const app = await NestFactory.create(AppModule);

	app.enableCors({ origin: '*' });
	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.setGlobalPrefix(Endpoints.Global);

	await app.listen(PORT, () => {
		app.get(SnatchedService).debug(`SERVER STARTED ON PORT ${PORT}`, 'SERVER');
	});
}

bootstrap();
