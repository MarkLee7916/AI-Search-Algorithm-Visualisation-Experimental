import {
  areObjectsEqualDisregardingRefs,
  arrayOfRandomIntsBetween,
  assertDefined,
  assertNonNull,
  filterStr,
  initGenericGrid,
  isCharNumeric,
  randomIntBetween,
  removeItemFromArray,
  safeGetArrayIndex,
  sequenceBetween,
  sumNumArray,
  wait,
} from './genericUtils';

describe('Generic utilities', () => {
  describe('randomIntBetween', () => {
    it('produces result within bounds', () => {
      expect(randomIntBetween(1, 100)).toBeLessThan(100);
      expect(randomIntBetween(1, 100)).toBeGreaterThanOrEqual(1);
    });
  });

  describe('arrayOfRandomIntsBetween', () => {
    it('produces array of correct size', () => {
      expect(arrayOfRandomIntsBetween(1, 10, 100).length).toBe(100);
      expect(arrayOfRandomIntsBetween(1, 10, 0).length).toBe(0);
    });
  });

  describe('wait', () => {
    it('delays by at least the amount of time passed in', async () => {
      const timeBeforeWait = Date.now();
      const delay = 1000;

      await wait(delay);

      expect(Date.now() - timeBeforeWait).toBeGreaterThanOrEqual(delay);
    });
  });

  describe('filterStr', () => {
    it('does not change an empty string', () => {
      expect(filterStr('', () => true)).toBe('');
      expect(filterStr('', () => false)).toBe('');
    });

    it('filters a specific character', () => {
      expect(filterStr('abc', (char) => char !== 'a')).toBe('bc');
      expect(filterStr('abc', (char) => char !== 'b')).toBe('ac');
      expect(filterStr('abc', (char) => char !== 'c')).toBe('ab');
    });
  });

  describe('isCharNumeric', () => {
    it('does not find letters or symbols numeric', () => {
      expect(isCharNumeric('a')).toBeFalse();
      expect(isCharNumeric('z')).toBeFalse();
      expect(isCharNumeric('!')).toBeFalse();
      expect(isCharNumeric('\n')).toBeFalse();
      expect(isCharNumeric('o')).toBeFalse();
    });

    it('finds numbers numeric', () => {
      expect(isCharNumeric('0')).toBeTrue();
      expect(isCharNumeric('1')).toBeTrue();
      expect(isCharNumeric('3')).toBeTrue();
      expect(isCharNumeric('5')).toBeTrue();
      expect(isCharNumeric('7')).toBeTrue();
    });
  });

  describe('assertDefined', () => {
    it('throws when undefined', () => {
      expect(() => assertDefined(undefined)).toThrowError(
        'Argument is undefined!'
      );
    });

    it('returns same result when defined', () => {
      expect(assertDefined('0')).toBe('0');
      expect(assertDefined(1)).toBe(1);
      expect(assertDefined(null)).toBe(null);
    });
  });

  describe('assertNonNull', () => {
    it('throws when null', () => {
      expect(() => assertNonNull(null)).toThrowError('Argument is null!');
    });

    it('returns same result when non null', () => {
      expect(assertNonNull('0')).toBe('0');
      expect(assertNonNull(1)).toBe(1);
      expect(assertNonNull(undefined)).toBe(undefined);
    });
  });

  describe('sumNumArray', () => {
    it('returns sum of array', () => {
      expect(sumNumArray([])).toBe(0);
      expect(sumNumArray([1])).toBe(1);
      expect(sumNumArray([1, 2])).toBe(3);
      expect(sumNumArray([-1, 100])).toBe(99);
      expect(sumNumArray([1, 2, 3])).toBe(6);
    });
  });

  describe('sequenceBetween', () => {
    it('returns [1..N-1]', () => {
      expect(sequenceBetween(1, 5)).toEqual([1, 2, 3, 4]);
      expect(sequenceBetween(1, 1)).toEqual([]);
      expect(sequenceBetween(1, 2)).toEqual([1]);
    });
  });

  describe('removeItemFromArray', () => {
    it('removes the item when it exists', () => {
      const arr1 = [1];
      const arr2 = [2, 3];
      const arr3 = [4, 5, 6];
      const arr4 = [4, 6, 6, 7];

      removeItemFromArray(arr1, 1);
      removeItemFromArray(arr2, 2);
      removeItemFromArray(arr3, 6);
      removeItemFromArray(arr4, 6);

      expect(arr1).toEqual([]);
      expect(arr2).toEqual([3]);
      expect(arr3).toEqual([4, 5]);
      expect(arr4).toEqual([4, 6, 7]);
    });

    it('does nothing when it does not exist', () => {
      const arr1: number[] = [];
      const arr2 = [2, 3];
      const arr3 = [4, 5, 6];
      const arr4 = [4, 6, 6, 7];

      removeItemFromArray(arr1, 1);
      removeItemFromArray(arr2, 1);
      removeItemFromArray(arr3, 7);
      removeItemFromArray(arr4, 8);

      expect(arr1).toEqual(arr1);
      expect(arr2).toEqual(arr2);
      expect(arr3).toEqual(arr3);
      expect(arr4).toEqual(arr4);
    });
  });

  describe('initGenericGrid', () => {
    it('returns correct grid', () => {
      const grid = initGenericGrid(10, 10, (row, col) => row + col);

      expect(grid.length).toBe(10);

      grid.forEach((row, rowIndex) => {
        expect(row.length).toBe(10);
        row.forEach((col, colIndex) => {
          expect(col).toBe(rowIndex + colIndex);
        });
      });
    });
  });

  describe('safeGetArrayIndex', () => {
    it('returns correct index', () => {
      const arr = [1, 2, 3];

      expect(safeGetArrayIndex(arr, -1)).toBe(0);
      expect(safeGetArrayIndex(arr, 3)).toBe(2);
      expect(safeGetArrayIndex(arr, 2)).toBe(2);
      expect(safeGetArrayIndex(arr, 1)).toBe(1);
    });
  });

  describe('areObjectsEqualDisregardingRefs', () => {
    it('returns true for objects that are purely equal', () => {
      expect(
        areObjectsEqualDisregardingRefs({ a: 1, b: 2 }, { a: 1, b: 2 })
      ).toBeTrue();

      expect(areObjectsEqualDisregardingRefs([1, 2, 3], [1, 2, 3])).toBeTrue();
    });

    it('returns true for objects that are equal when refs disregarded', () => {
      expect(
        areObjectsEqualDisregardingRefs({ a: 1, d: {} }, { a: 1, d: { a: 1 } })
      ).toBeTrue();

      expect(
        areObjectsEqualDisregardingRefs([1, 2, 3, {}], [1, 2, 3, { a: 2 }])
      ).toBeTrue();
    });

    it('returns false for objects that are not equal', () => {
      expect(areObjectsEqualDisregardingRefs({ a: 2 }, { a: 1 })).toBeFalse();

      expect(areObjectsEqualDisregardingRefs([1, 2, 4], [1, 2, 3])).toBeFalse();
    });
  });
});
