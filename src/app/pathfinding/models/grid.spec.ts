import {
  formatPosForDisplayAsCoord,
  genRandomWeight,
  HEIGHT,
  isPosOnGrid,
  posListHasPos,
  WIDTH,
} from './grid';

describe('grid', () => {
  describe('genRandomWeight', () => {
    it('generates weight inside bounds', () => {
      const result = genRandomWeight();

      expect(result).toBeGreaterThanOrEqual(2);
      expect(result).toBeLessThan(30);
    });
  });

  describe('posListHasPos', () => {
    it('returns correct result', () => {
      const posList = [
        { row: 1, col: 1 },
        { row: 2, col: 2 },
      ];

      expect(posListHasPos(posList, { row: 1, col: 1 })).toBeTrue();
      expect(posListHasPos(posList, { row: 2, col: 2 })).toBeTrue();
      expect(posListHasPos(posList, { row: 1, col: 2 })).toBeFalse();
      expect(posListHasPos(posList, { row: 2, col: 1 })).toBeFalse();
    });
  });

  describe('formatPosForDisplayAsCoord', () => {
    it('formats coords properly', () => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const coordStr = formatPosForDisplayAsCoord({ row, col });

          expect(coordStr[1]).toBe(`${col + 1}`);
          expect(coordStr[4]).toBe(`${row + 1}`);
        }
      }
    });
  });

  describe('isPosOnGrid', () => {
    it('returns the correct result', () => {
      expect(isPosOnGrid({ row: 0, col: -1 })).toBeFalse();
      expect(isPosOnGrid({ row: -1, col: 0 })).toBeFalse();
      expect(isPosOnGrid({ row: HEIGHT, col: 0 })).toBeFalse();
      expect(isPosOnGrid({ row: 0, col: WIDTH })).toBeFalse();
      expect(isPosOnGrid({ row: 0, col: 0 })).toBeTrue();
      expect(isPosOnGrid({ row: HEIGHT - 1, col: WIDTH - 1 })).toBeTrue();
    });
  });
});
