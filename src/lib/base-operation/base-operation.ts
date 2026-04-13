import { Either, either } from '../either';

export abstract class BaseOperation<TParams, TSuccess, TError extends Error> {
  protected params: TParams;

  constructor(params: TParams) {
    this.params = params;
  }

  abstract call(): Promise<Either<TError, TSuccess>>;

  protected ok(payload: TSuccess): Either<TError, TSuccess> {
    return either.right(payload);
  }

  protected fail(error: TError): Either<TError, TSuccess> {
    return either.left(error);
  }
}
