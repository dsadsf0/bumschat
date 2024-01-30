import { HttpException, HttpStatus } from '@nestjs/common';
import { WsException } from '@nestjs/websockets/errors/ws-exception';

const handleError = (error: unknown): HttpException | WsException => {
    if (error instanceof HttpException) {
        throw error;
    }
    if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
};

export default handleError;
