import cloneDeep from 'clone-deep';
import { UncheckedObjMap } from './uncheckedObjMap';

describe('Unchecked object map', () => {
  it('Works for arbitrary nested object', () => {
    type TestObjType = { x: number; y: string[] };

    const testKey1 = { x: 1, y: ['1'] };
    const testKey2 = { x: 2, y: ['2'] };

    const uncheckedObjMap = new UncheckedObjMap<TestObjType, number>([
      [testKey1, 1],
    ]);

    uncheckedObjMap.set(testKey2, 2);

    expect(uncheckedObjMap.get(cloneDeep(testKey1))).toBe(1);
    expect(uncheckedObjMap.get(testKey2)).toBe(2);

    testKey2.x = 100;

    expect(() => uncheckedObjMap.get(testKey2)).toThrowError(
      'Argument is undefined!'
    );
  });
});
