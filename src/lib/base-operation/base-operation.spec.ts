import { BaseOperation } from './base-operation';
import { Either, either, isLeft, isRight } from '../either';

class TestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TestError';
  }
}

interface TestParams {
  name: string;
}

interface TestResult {
  id: string;
  name: string;
}

class TestOperation extends BaseOperation<TestParams, TestResult, TestError> {
  async call(): Promise<Either<TestError, TestResult>> {
    if (!this.params.name) {
      return either.left(new TestError('Name is required'));
    }

    const result: TestResult = {
      id: '123',
      name: this.params.name,
    };

    return either.right(result);
  }
}

describe('BaseOperation', () => {
  describe('call', () => {
    it('should return Right with result on success', async () => {
      const operation = new TestOperation({ name: 'Test' });
      const result = await operation.call();

      expect(isRight(result)).toBe(true);
      if (isRight(result)) {
        expect(result.value).toEqual({ id: '123', name: 'Test' });
      }
    });

    it('should return Left with error on failure', async () => {
      const operation = new TestOperation({ name: '' });
      const result = await operation.call();

      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) {
        expect(result.value.message).toBe('Name is required');
      }
    });
  });
});
