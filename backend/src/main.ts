import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'src/app/app.module';
import { SnatchedService } from 'src/modules/snatched-logger/logger.service';
import * as cookieParser from 'cookie-parser';
import Endpoints from 'src/core/consts/endpoint';

async function bootstrap(): Promise<void> {
	const PORT = process.env.PORT;

	const app = await NestFactory.create(AppModule);

	app.enableCors({ origin: 'http://176.212.63.19:5173', credentials: true });
	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.setGlobalPrefix(Endpoints.Global);

	const swaggerConfig = new DocumentBuilder().setTitle('Bums chat Swagger').setDescription('Documentation').setVersion('1.4.8.8').build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup(`${Endpoints.Global}/docs`, app, document);

	await app.listen(PORT, () => {
		app.get(SnatchedService).debug(`SERVER STARTED ON PORT ${PORT}`, 'SERVER');
	});
}

bootstrap();
