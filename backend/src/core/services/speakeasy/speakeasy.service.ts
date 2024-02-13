import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import { ErrorHandler } from 'src/core/decorators/errorHandler.decorator';
import { SnatchedLogger } from 'src/core/services/snatched-logger/logger.service';

@Injectable()
export class SpeakeasyService {
    constructor(private readonly logger: SnatchedLogger) {}

    @ErrorHandler(SpeakeasyService.name)
    public generateSecret(username: string): speakeasy.GeneratedSecret {
        return speakeasy.generateSecret({
            name: `Bums Chat: ${username}`,
        });
    }

    @ErrorHandler(SpeakeasyService.name)
    public validateCode(userSecret: string, code: string): boolean {
        return speakeasy.totp.verify({
            secret: userSecret,
            encoding: 'base32',
            token: code,
        });
    }
}
