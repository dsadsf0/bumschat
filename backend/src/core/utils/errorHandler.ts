import { HttpException, HttpStatus } from '@nestjs/common';

const handleError = (error: unknown): HttpException => {
	if (error instanceof HttpException) {
		throw error;
	}
	if (error instanceof Error) {
		throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
};

export default handleError;
