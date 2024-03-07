import { HttpException, HttpStatus } from '@nestjs/common';

export class BlockchainException extends HttpException {
  constructor(message: string, status: HttpStatus, isBlockchainError: boolean) {
    super(
      {
        message,
        isBlockchainError,
      },
      status,
    );
  }
}
