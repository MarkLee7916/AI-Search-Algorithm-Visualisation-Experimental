import { initGenericGrid } from 'src/app/shared/genericUtils';

export type Board = boolean[][];

// A position on the board
export type Pos = { row: number; col: number };

// The minumum size the user is allowed to set a board to in terms of tile count
export const MIN_BOARD_SIZE = 4;

// The maximum size the user is allowed to set a board to in terms of tile count
export const MAX_BOARD_SIZE = 10;

// Generate a board with no queens placed on it
export function genEmptyBoard(size: number): Board {
  return initGenericGrid(size, size, () => false);
}

// Place a queen at the given position on the board
export function setQueen(
  board: Board,
  row: number,
  col: number,
  isQueen: boolean
): void {
  board[row][col] = isQueen;
}

// Return true if a queen placement doesn't conflict with any already placed queens
export function isValidQueenPlacement(
  board: Board,
  row: number,
  col: number
): boolean {
  return (
    !hasQueenInSameCol(board, row, col) &&
    !hasQueenInSameDiagonal(board, row, col)
  );
}

// Return true if the board has a queen at the given position
export function hasQueen(board: Board, row: number, col: number): boolean {
  return (
    row >= 0 &&
    col >= 0 &&
    row < board.length &&
    col < board.length &&
    board[row][col]
  );
}

// Return true if a board follows the rules of the N-Queens problem
export function isBoardSolved(board: Board): boolean {
  return getQueenCount(board) === board.length && isEveryPlacementValid(board);
}

// Get the number of queens that have been placed on the board
export function getQueenCount(board: Board): number {
  return board.reduce(
    (total, row) =>
      total +
      row.reduce((rowTotal, isQueen) => rowTotal + (isQueen ? 1 : 0), 0),
    0
  );
}

// Given a row, find the corresponding column a queen has been placed on, returning -1 if there isn't one
export function findQueenColAtRow(board: Board, row: number): number {
  return board[row].indexOf(true);
}

function hasQueenInSameDiagonal(
  board: Board,
  row: number,
  col: number
): boolean {
  for (let offset = 1; offset < board.length; offset++) {
    if (
      hasQueen(board, row - offset, col - offset) ||
      hasQueen(board, row - offset, col + offset) ||
      hasQueen(board, row + offset, col - offset) ||
      hasQueen(board, row + offset, col + offset)
    ) {
      return true;
    }
  }

  return false;
}

function hasQueenInSameCol(
  board: Board,
  rowPlaced: number,
  colPlaced: number
): boolean {
  for (let row = 0; row < board.length; row++) {
    if (row !== rowPlaced && hasQueen(board, row, colPlaced)) {
      return true;
    }
  }

  return false;
}

function isEveryPlacementValid(board: Board): boolean {
  return board.every((row, rowIndex) =>
    row.every(
      (isQueen, colIndex) =>
        !isQueen || isValidQueenPlacement(board, rowIndex, colIndex)
    )
  );
}
