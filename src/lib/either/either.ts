export type Either<L, R> = Left<L> | Right<R>;

export class Left<L> {
  constructor(public readonly value: L) {}

  isLeft(): this is Left<L> {
    return true;
  }

  isRight(): boolean {
    return false;
  }
}

export class Right<R> {
  constructor(public readonly value: R) {}

  isLeft(): boolean {
    return false;
  }

  isRight(): this is Right<R> {
    return true;
  }
}

export const either = {
  left: <L>(value: L): Either<L, never> => new Left(value),
  right: <R>(value: R): Either<never, R> => new Right(value),
};

export function isLeft<L, R>(either: Either<L, R>): either is Left<L> {
  return either.isLeft();
}

export function isRight<L, R>(either: Either<L, R>): either is Right<R> {
  return either.isRight();
}
