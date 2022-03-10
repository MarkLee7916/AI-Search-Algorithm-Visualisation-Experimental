import { genFilledGridMaze, genRandomMaze } from './mazeGenAlgos';

describe('Maze Generation Algorithms', () => {
  describe('genRandomMaze', () => {
    it('generates a non empty maze', () => {
      expect(genRandomMaze().some((row) => row.includes(true))).toBeTrue();
    });
    it('generates a non full maze', () => {
      expect(genRandomMaze().some((row) => row.includes(false))).toBeTrue();
    });
  });

  describe('genFilledGridMaze', () => {
    it('generates a full maze', () => {
      expect(
        genFilledGridMaze().some((row) => row.includes(false))
      ).toBeFalse();
    });
  });
});
