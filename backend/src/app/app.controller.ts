import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import Endpoints from 'src/core/consts/endpoint';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @ApiTags('Ping')
    @Get(Endpoints.Ping)
    ping(): string {
        return this.appService.ping();
    }
}
