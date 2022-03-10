import { initGenericGrid } from 'src/app/shared/genericUtils';

export type Board = boolean[][];

export const MIN_BOARD_SIZE = 4;

export const MAX_BOARD_SIZE = 10;

export function genEmptyBoard(size: number): Board {
  return initGenericGrid(size, size, () => false);
}

export function setQueen(
  board: Board,
  row: number,
  col: number,
  isQueen: boolean
): void {
  board[row][col] = isQueen;
}

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

export function hasQueen(board: Board, row: number, col: number): boolean {
  return (
    row >= 0 &&
    col >= 0 &&
    row < board.length &&
    col < board.length &&
    board[row][col]
  );
}

export function isBoardSolved(board: Board): boolean {
  return getQueenCount(board) === board.length && isEveryPlacementValid(board);
}

export function getQueenCount(board: Board): number {
  return board.reduce(
    (total, row) =>
      total +
      row.reduce((rowTotal, isQueen) => rowTotal + (isQueen ? 1 : 0), 0),
    0
  );
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
