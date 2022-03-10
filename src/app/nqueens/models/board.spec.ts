import {
  genEmptyBoard,
  getQueenCount,
  isBoardSolved,
  isValidQueenPlacement,
  setQueen,
} from './board';

describe('Board', () => {
  describe('isValidQueenPlacement', () => {
    it('returns correct answers for sizes [4..10]', () => {
      for (let size = 4; size <= 10; size++) {
        const board = genEmptyBoard(size);

        setQueen(board, 0, 0, true);
        setQueen(board, 1, 3, true);

        expect(isValidQueenPlacement(board, 2, 0)).toBeFalse();
        expect(isValidQueenPlacement(board, 2, 1)).toBeTrue();
        expect(isValidQueenPlacement(board, 2, 2)).toBeFalse();
        expect(isValidQueenPlacement(board, 2, 3)).toBeFalse();

        expect(isValidQueenPlacement(board, 3, 0)).toBeFalse();
        expect(isValidQueenPlacement(board, 3, 1)).toBeFalse();
        expect(isValidQueenPlacement(board, 3, 2)).toBeTrue();
        expect(isValidQueenPlacement(board, 3, 3)).toBeFalse();
      }
    });
  });

  describe('isBoardSolved', () => {
    it('returns correct answer for default N = 4 case', () => {
      const board = genEmptyBoard(4);

      setQueen(board, 0, 1, true);
      setQueen(board, 1, 3, true);
      setQueen(board, 2, 0, true);
      setQueen(board, 3, 2, true);

      expect(isBoardSolved(board)).toBeTrue();
    });

    it('returns correct answer for default N = 5 case', () => {
      const board = genEmptyBoard(5);

      setQueen(board, 0, 0, true);
      setQueen(board, 1, 2, true);
      setQueen(board, 2, 4, true);
      setQueen(board, 3, 1, true);
      setQueen(board, 4, 3, true);

      expect(isBoardSolved(board)).toBeTrue();
    });

    it('returns correct answer for default N = 6 case', () => {
      const board = genEmptyBoard(6);

      setQueen(board, 0, 1, true);
      setQueen(board, 1, 3, true);
      setQueen(board, 2, 5, true);
      setQueen(board, 3, 0, true);
      setQueen(board, 4, 2, true);
      setQueen(board, 5, 4, true);

      expect(isBoardSolved(board)).toBeTrue();
    });
  });

  describe('getQueenCount', () => {
    it('returns correct answer for default N = 4 case', () => {
      const board = genEmptyBoard(4);

      setQueen(board, 0, 1, true);
      setQueen(board, 1, 3, true);
      setQueen(board, 2, 0, true);
      setQueen(board, 3, 2, true);

      expect(getQueenCount(board)).toEqual(4);
    });

    it('returns correct answer for default N = 5 case', () => {
      const board = genEmptyBoard(5);

      setQueen(board, 0, 0, true);
      setQueen(board, 1, 2, true);
      setQueen(board, 2, 4, true);
      setQueen(board, 3, 1, true);
      setQueen(board, 4, 3, true);

      expect(getQueenCount(board)).toEqual(5);
    });

    it('returns correct answer for default N = 6 case', () => {
      const board = genEmptyBoard(6);

      setQueen(board, 0, 1, true);
      setQueen(board, 1, 3, true);
      setQueen(board, 2, 5, true);
      setQueen(board, 3, 0, true);
      setQueen(board, 4, 2, true);
      setQueen(board, 5, 4, true);

      expect(getQueenCount(board)).toEqual(6);
    });
  });
});
