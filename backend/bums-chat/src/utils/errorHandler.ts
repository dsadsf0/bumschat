import { HttpException, HttpStatus } from '@nestjs/common';

const handleError = (error: unknown): void => {
	if (error instanceof HttpException) {
		throw error;
	}
	if (error instanceof Error) {
		throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
};

export default handleError;
