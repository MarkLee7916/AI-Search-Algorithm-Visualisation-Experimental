import { getQueenCount, isBoardSolved, MAX_BOARD_SIZE } from '../models/board';
import { backtracking } from './backtracking';

describe('Backtracking', () => {
  it('returns solved board for N = [4..MAX_BOARD_SIZE]', () => {
    for (let boardSize = 4; boardSize <= MAX_BOARD_SIZE; boardSize++) {
      const output = backtracking(boardSize);
      const finalOutput = output[output.length - 1];
      const finalBoard = finalOutput.board;

      expect(isBoardSolved(finalBoard)).toBeTrue();
    }
  });

  it('returns empty board for N = 3]', () => {
    const output = backtracking(3);
    const finalOutput = output[output.length - 1];
    const finalBoard = finalOutput.board;

    expect(getQueenCount(finalBoard)).toEqual(0);
  });
});
