import { Either, Left, Right, either, isLeft, isRight } from './either';

describe('Either', () => {
  describe('Left', () => {
    it('should create Left with value', () => {
      const left = new Left('error');
      expect(left.value).toBe('error');
    });

    it('should identify as Left', () => {
      const left = new Left('error');
      expect(left.isLeft()).toBe(true);
      expect(left.isRight()).toBe(false);
    });
  });

  describe('Right', () => {
    it('should create Right with value', () => {
      const right = new Right(42);
      expect(right.value).toBe(42);
    });

    it('should identify as Right', () => {
      const right = new Right(42);
      expect(right.isLeft()).toBe(false);
      expect(right.isRight()).toBe(true);
    });
  });

  describe('either helper', () => {
    it('should create Left', () => {
      const result = either.left('error');
      expect(isLeft(result)).toBe(true);
    });

    it('should create Right', () => {
      const result = either.right(42);
      expect(isRight(result)).toBe(true);
    });
  });

  describe('isLeft/isRight', () => {
    it('should correctly identify Left', () => {
      const left: Either<string, number> = either.left('error');
      expect(isLeft(left)).toBe(true);
      expect(isRight(left)).toBe(false);
    });

    it('should correctly identify Right', () => {
      const right: Either<string, number> = either.right(42);
      expect(isLeft(right)).toBe(false);
      expect(isRight(right)).toBe(true);
    });
  });
});
