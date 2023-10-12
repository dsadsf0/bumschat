import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import Endpoints from './consts/endpoint';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get(Endpoints.Ping)
	ping(): string {
		return this.appService.ping();
	}
}
