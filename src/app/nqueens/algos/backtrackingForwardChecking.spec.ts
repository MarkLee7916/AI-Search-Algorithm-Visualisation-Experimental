import { MAX_BOARD_SIZE, isBoardSolved, getQueenCount } from '../models/board';
import { backtrackingWithForwardChecking } from './backtrackingForwardChecking';
import { pruneDomainsForArcConsistency } from './pruningArcConsistency';
import { pruneDomainsForNodeConsistency } from './pruningNodeConsistency';

describe('Backtracking with forward checking', () => {
  describe('no heuristics and node consistency', () => {
    it('returns solved board for N = [4..MAX_BOARD_SIZE]', () => {
      for (let boardSize = 4; boardSize <= MAX_BOARD_SIZE; boardSize++) {
        const output = backtrackingWithForwardChecking(
          boardSize,
          false,
          false,
          pruneDomainsForNodeConsistency
        );
        const finalOutput = output[output.length - 1];
        const finalBoard = finalOutput.board;

        expect(isBoardSolved(finalBoard)).toBeTrue();
      }
    });

    it('returns empty board for N = 3', () => {
      const output = backtrackingWithForwardChecking(
        3,
        false,
        false,
        pruneDomainsForNodeConsistency
      );
      const finalOutput = output[output.length - 1];
      const finalBoard = finalOutput.board;

      expect(getQueenCount(finalBoard)).toEqual(0);
    });
  });

  describe('most constrained variable heuristic and node consistency', () => {
    it('returns solved board for N = [4..MAX_BOARD_SIZE]', () => {
      for (let boardSize = 4; boardSize <= MAX_BOARD_SIZE; boardSize++) {
        const output = backtrackingWithForwardChecking(
          boardSize,
          false,
          true,
          pruneDomainsForNodeConsistency
        );
        const finalOutput = output[output.length - 1];
        const finalBoard = finalOutput.board;

        expect(isBoardSolved(finalBoard)).toBeTrue();
      }
    });

    it('returns empty board for N = 3', () => {
      const output = backtrackingWithForwardChecking(
        3,
        false,
        true,
        pruneDomainsForNodeConsistency
      );
      const finalOutput = output[output.length - 1];
      const finalBoard = finalOutput.board;

      expect(getQueenCount(finalBoard)).toEqual(0);
    });
  });

  describe('least constraining value heuristic and node consistency', () => {
    it('returns solved board for N = [4..MAX_BOARD_SIZE]', () => {
      for (let boardSize = 4; boardSize <= MAX_BOARD_SIZE; boardSize++) {
        const output = backtrackingWithForwardChecking(
          boardSize,
          true,
          false,
          pruneDomainsForNodeConsistency
        );
        const finalOutput = output[output.length - 1];
        const finalBoard = finalOutput.board;

        expect(isBoardSolved(finalBoard)).toBeTrue();
      }
    });

    it('returns empty board for N = 3', () => {
      const output = backtrackingWithForwardChecking(
        3,
        true,
        false,
        pruneDomainsForNodeConsistency
      );
      const finalOutput = output[output.length - 1];
      const finalBoard = finalOutput.board;

      expect(getQueenCount(finalBoard)).toEqual(0);
    });
  });

  describe('least constraining value and most constrained variable heuristics and node consistency', () => {
    it('returns solved board for N = [4..MAX_BOARD_SIZE]', () => {
      for (let boardSize = 4; boardSize <= MAX_BOARD_SIZE; boardSize++) {
        const output = backtrackingWithForwardChecking(
          boardSize,
          true,
          true,
          pruneDomainsForNodeConsistency
        );
        const finalOutput = output[output.length - 1];
        const finalBoard = finalOutput.board;

        expect(isBoardSolved(finalBoard)).toBeTrue();
      }
    });

    it('returns empty board for N = 3', () => {
      const output = backtrackingWithForwardChecking(
        3,
        true,
        true,
        pruneDomainsForNodeConsistency
      );
      const finalOutput = output[output.length - 1];
      const finalBoard = finalOutput.board;

      expect(getQueenCount(finalBoard)).toEqual(0);
    });
  });

  describe('no heuristics and arc consistency', () => {
    it('returns solved board for N = [4..MAX_BOARD_SIZE]', () => {
      for (let boardSize = 4; boardSize <= MAX_BOARD_SIZE; boardSize++) {
        const output = backtrackingWithForwardChecking(
          boardSize,
          false,
          false,
          pruneDomainsForArcConsistency
        );
        const finalOutput = output[output.length - 1];
        const finalBoard = finalOutput.board;

        expect(isBoardSolved(finalBoard)).toBeTrue();
      }
    });

    it('returns empty board for N = 3', () => {
      const output = backtrackingWithForwardChecking(
        3,
        false,
        false,
        pruneDomainsForArcConsistency
      );
      const finalOutput = output[output.length - 1];
      const finalBoard = finalOutput.board;

      expect(getQueenCount(finalBoard)).toEqual(0);
    });
  });

  describe('most constrained variable heuristic and arc consistency', () => {
    it('returns solved board for N = [4..MAX_BOARD_SIZE]', () => {
      for (let boardSize = 4; boardSize <= MAX_BOARD_SIZE; boardSize++) {
        const output = backtrackingWithForwardChecking(
          boardSize,
          false,
          true,
          pruneDomainsForArcConsistency
        );
        const finalOutput = output[output.length - 1];
        const finalBoard = finalOutput.board;

        expect(isBoardSolved(finalBoard)).toBeTrue();
      }
    });

    it('returns empty board for N = 3', () => {
      const output = backtrackingWithForwardChecking(
        3,
        false,
        true,
        pruneDomainsForArcConsistency
      );
      const finalOutput = output[output.length - 1];
      const finalBoard = finalOutput.board;

      expect(getQueenCount(finalBoard)).toEqual(0);
    });
  });

  describe('least constraining value heuristic and arc consistency', () => {
    it('returns solved board for N = [4..MAX_BOARD_SIZE]', () => {
      for (let boardSize = 4; boardSize <= MAX_BOARD_SIZE; boardSize++) {
        const output = backtrackingWithForwardChecking(
          boardSize,
          true,
          false,
          pruneDomainsForArcConsistency
        );
        const finalOutput = output[output.length - 1];
        const finalBoard = finalOutput.board;

        expect(isBoardSolved(finalBoard)).toBeTrue();
      }
    });

    it('returns empty board for N = 3', () => {
      const output = backtrackingWithForwardChecking(
        3,
        true,
        false,
        pruneDomainsForArcConsistency
      );
      const finalOutput = output[output.length - 1];
      const finalBoard = finalOutput.board;

      expect(getQueenCount(finalBoard)).toEqual(0);
    });
  });

  describe('least constraining value and most constrained variable heuristics and arc consistency', () => {
    it('returns solved board for N = [4..MAX_BOARD_SIZE]', () => {
      for (let boardSize = 4; boardSize <= MAX_BOARD_SIZE; boardSize++) {
        const output = backtrackingWithForwardChecking(
          boardSize,
          true,
          true,
          pruneDomainsForArcConsistency
        );
        const finalOutput = output[output.length - 1];
        const finalBoard = finalOutput.board;

        expect(isBoardSolved(finalBoard)).toBeTrue();
      }
    });

    it('returns empty board for N = 3', () => {
      const output = backtrackingWithForwardChecking(
        3,
        true,
        true,
        pruneDomainsForArcConsistency
      );
      const finalOutput = output[output.length - 1];
      const finalBoard = finalOutput.board;

      expect(getQueenCount(finalBoard)).toEqual(0);
    });
  });
});
