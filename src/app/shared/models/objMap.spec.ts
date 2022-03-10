import cloneDeep from 'clone-deep';
import { ObjMap } from './objMap';

describe('Object map', () => {
  it('Works for arbitrary nested object', () => {
    type TestObjType = { x: number; y: string[] };

    const testKey1 = { x: 1, y: ['1'] };
    const testKey2 = { x: 2, y: ['2'] };

    const objMap = new ObjMap<TestObjType, number>([[testKey1, 1]]);

    objMap.set(testKey2, 2);

    expect(objMap.get(cloneDeep(testKey1))).toBe(1);
    expect(objMap.get(testKey2)).toBe(2);

    testKey2.x = 100;

    expect(objMap.get(testKey2)).toBe(undefined);
  });
});
