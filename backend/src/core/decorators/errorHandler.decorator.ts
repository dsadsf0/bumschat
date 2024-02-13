import { HttpException, HttpStatus } from '@nestjs/common';
import * as uuid from 'uuid';
import { SnatchedLogger } from '../services/snatched-logger/logger.service';

const logger = new SnatchedLogger();

type ErrorWithId = {
    id: string;
};

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
        descriptor.value = function (...args: unknown[]): unknown {
            try {
                return originalMethod.apply(this, args);
            } catch (error) {
                const treatedError = error as ErrorWithId;
                if (typeof error === 'object') {
                    treatedError.id = treatedError.id ?? uuid.v4();
                }

                logger.error(treatedError, `${serviceName}/${propertyKey.toString()}`);
                handleError(treatedError);
            }
        };
    };
}
