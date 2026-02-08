import { HttpStatus } from '@nestjs/common';

export class OperationResponse<T> {
  exception: Error | null;
  payload: T;
  status: HttpStatus;
  message: string;

  constructor(data: {
    exception: Error | null;
    payload: T;
    status: HttpStatus;
    message: string;
  }) {
    this.exception = data.exception;
    this.payload = data.payload;
    this.status = data.status;
    this.message = data.message;
  }
}
