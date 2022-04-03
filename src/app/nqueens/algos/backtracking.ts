import cloneDeep from 'clone-deep';
import {
  BoardAnimationFrame,
  initBlankBoardAnimationFrame,
  genBoardAnimationFrame,
} from '../models/animation';
import {
  genEmptyBoard,
  Board,
  setQueen,
  isValidQueenPlacement,
} from '../models/board';

// Implementation of backtracking without forward checking or heuristics
export function backtracking(boardSize: number): BoardAnimationFrame[] {
  const boardAnimationFrames = [initBlankBoardAnimationFrame(boardSize)];
  const solvedBoard = backtrackingRecurse(
    genEmptyBoard(boardSize),
    0,
    boardAnimationFrames
  );

  if (solvedBoard === null) {
    boardAnimationFrames.push(
      genBoardAnimationFrame(
        genEmptyBoard(boardSize),
        'No Solution Found!',
        null
      )
    );
  }

  return boardAnimationFrames;
}

// Recursive implemention of backtracking without forward checking or heuristics
function backtrackingRecurse(
  board: Board,
  rowToPlaceAt: number,
  boardAnimationFrames: BoardAnimationFrame[]
): Board | null {
  if (rowToPlaceAt === board.length) {
    boardAnimationFrames.push(
      genBoardAnimationFrame(board, 'Solution Found!', null)
    );

    return board;
  }

  for (let colToPlaceAt = 0; colToPlaceAt < board.length; colToPlaceAt++) {
    setQueen(board, rowToPlaceAt, colToPlaceAt, true);

    boardAnimationFrames.push(
      genBoardAnimationFrame(
        board,
        'Assigning Queen to column...',
        rowToPlaceAt
      )
    );

    if (isValidQueenPlacement(board, rowToPlaceAt, colToPlaceAt)) {
      boardAnimationFrames.push(
        genBoardAnimationFrame(board, 'Assignment is valid!', rowToPlaceAt)
      );

      const solvedBoard = backtrackingRecurse(
        cloneDeep(board),
        rowToPlaceAt + 1,
        boardAnimationFrames
      );

      if (solvedBoard !== null) {
        return solvedBoard;
      }

      boardAnimationFrames.push(
        genBoardAnimationFrame(
          board,
          'Assignment has lead to failure for a later row, so no solutions can be generated from this partial configuration',
          rowToPlaceAt
        )
      );
    } else {
      boardAnimationFrames.push(
        genBoardAnimationFrame(board, 'Assignment is invalid!', rowToPlaceAt)
      );
    }

    boardAnimationFrames.push(
      genBoardAnimationFrame(
        board,
        'Will try again for next column...',
        rowToPlaceAt
      )
    );

    setQueen(board, rowToPlaceAt, colToPlaceAt, false);
  }

  boardAnimationFrames.push(
    genBoardAnimationFrame(
      board,
      'No valid assignment found, backtracking...',
      rowToPlaceAt
    )
  );

  return null;
}
