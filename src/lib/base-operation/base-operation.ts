import { HttpStatus } from '@nestjs/common';
import { OperationResponse } from './operation-response';

export class BaseOperation<TParams, TPayload> {
  protected params: TParams;
  model!: TPayload;

  public async call(): Promise<OperationResponse<TPayload>> {
    throw new Error('Call method must bet implemented');
  }

  protected resolve(httpStatus: HttpStatus = HttpStatus.OK, message: string) {
    return new OperationResponse({
      exception: null,
      payload: this.model,
      status: httpStatus,
      message,
    });
  }
}
