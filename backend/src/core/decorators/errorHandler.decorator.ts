import { HttpException, HttpStatus } from '@nestjs/common';
import { SnatchedLogger } from '../services/snatched-logger/logger.service';

const logger = new SnatchedLogger();

const handleError = (error: unknown): HttpException => {
    if (error instanceof HttpException) {
        throw error;
    }
    if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
};

export function ErrorHandler(serviceName: string): MethodDecorator {
    return function (_target: unknown, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: unknown[]): Promise<unknown> {
            try {
                return await originalMethod.apply(this, args);
            } catch (error) {
                logger.error(error, `${serviceName}/${propertyKey.toString()}`);
                handleError(error);
            }
        };
    };
}
