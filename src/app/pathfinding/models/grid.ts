import { initGenericGrid, randomIntBetween } from '../../shared/genericUtils';

export const enum TileAnimationFrame {
  Expanded,
  Visited,
  FinalPath,
  BeingExpanded,
  BeingAddedToAgenda,
  Blank,
}

export type Pos = { row: number; col: number };

export type GenNeighboursImpl = (pos: Pos) => Pos[];

export type GridAnimationFrame = {
  grid: TileAnimationFrame[][];
  commentary: string;
  gridDists: number[][];
};

export type GridWeights = number[][];

export type GridBarriers = boolean[][];

export type GridPositions = Pos[][];

export const HEIGHT = computeGridLenFromScreenLen(window.innerHeight, 60);

export const WIDTH = computeGridLenFromScreenLen(window.innerWidth, 60);

export const DEFAULT_WEIGHT = 1;

export const DEFAULT_START_POS = { row: 1, col: 1 };

export const DEFAULT_GOAL_POS = { row: HEIGHT - 2, col: WIDTH - 2 };

export function genRandomWeight(): number {
  return randomIntBetween(WEIGHT_LOWER_BOUND, WEIGHT_UPPER_BOUND);
}

export function initBlankGridWeights(): GridWeights {
  return initGenericGrid(HEIGHT, WIDTH, () => DEFAULT_WEIGHT);
}

export function initBlankGridBarriers(): GridBarriers {
  return initGenericGrid(HEIGHT, WIDTH, () => false);
}

export function initBlankGridAnimationFrame(): GridAnimationFrame {
  return {
    grid: initGenericGrid(HEIGHT, WIDTH, () => TileAnimationFrame.Blank),
    commentary: 'Nothing has happened yet!',
    gridDists: initGenericGrid(HEIGHT, WIDTH, () => Number.POSITIVE_INFINITY),
  };
}

export function initGridPositions(): GridPositions {
  return initGenericGrid(HEIGHT, WIDTH, (row, col) => ({ row, col }));
}

export function posListHasPos(posList: Pos[], posToCheckFor: Pos): boolean {
  return posList.some((pos) => isSamePos(pos, posToCheckFor));
}

export function isSamePos(pos1: Pos, pos2: Pos): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

export function formatPosForDisplayAsCoord({ row, col }: Pos): string {
  return `(${col + 1}, ${row + 1})`;
}

export function genUniquePosId(_: number, { row, col }: Pos): number {
  return 0.5 * (row + col) * (row + col + 1) + col;
}

export function genUniqueRowId(_: number, positions: Pos[]): string {
  return positions.map((pos) => genUniquePosId(_, pos)).toString();
}

export function genDiagonalNeighbours({ row, col }: Pos): Pos[] {
  return [
    { row: row - 1, col: col - 1 },
    { row: row - 1, col: col + 1 },
    { row: row + 1, col: col - 1 },
    { row: row + 1, col: col + 1 },
  ].filter((pos) => isPosOnGrid(pos));
}

export function genNonDiagonalNeighbours({ row, col }: Pos): Pos[] {
  return [
    { row, col: col - 1 },
    { row: row - 1, col },
    { row, col: col + 1 },
    { row: row + 1, col },
  ].filter((pos) => isPosOnGrid(pos));
}

export function genAllDirectionNeighbours(pos: Pos): Pos[] {
  return genDiagonalNeighbours(pos).concat(genNonDiagonalNeighbours(pos));
}

export function isPosOnGrid({ row, col }: Pos): boolean {
  return row >= 0 && row < HEIGHT && col >= 0 && col < WIDTH;
}

const WEIGHT_LOWER_BOUND = 2;

const WEIGHT_UPPER_BOUND = 30;

function computeGridLenFromScreenLen(
  screenLen: number,
  modifier: number
): number {
  const combinedScreenLen = window.innerHeight + window.innerWidth;

  return Math.round((screenLen / combinedScreenLen) * modifier);
}
