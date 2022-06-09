import { initGenericGrid, randomIntBetween } from '../../shared/genericUtils';

// An animation state a tile can be in
export const enum TileAnimationFrame {
  Expanded,
  Visited,
  FinalPath,
  BeingExpanded,
  BeingAddedToAgenda,
  Blank,
}

// An animation frame encapsulating the entire state of a step in a pathfinding algorithm
export type GridAnimationFrame = {
  grid: TileAnimationFrame[][];
  commentary: string;
  gridDists: number[][];
  numberOfTilesExpanded: number;
  numberOfTilesVisited: number;
  pathLength: number;
};

// A position on the grid corresponding to a tile
export type Pos = { row: number; col: number };

// A transformation to get a positions neighbour i.e top left, right
export type Neighbour = { vertical: number; horizontal: number };

// An implementation for generating the neighbours of a tile
export type FilterNeighboursImpl = (neighbours: Neighbour[]) => Neighbour[];

// The weights of the grid, where each weight is greater than zero
export type GridWeights = number[][];

// The barriers of the grid
export type GridBarriers = boolean[][];

// A matrix where each cell has its corresponding position as its value
export type GridPositions = Pos[][];

// The height of the grid in terms of number of tiles
export const HEIGHT = computeGridLenFromScreenLen(window.innerHeight, 40);

// The width of the grid in terms of number of tiles
export const WIDTH = computeGridLenFromScreenLen(window.innerWidth, 40);

// The weight each tile is automatically assigned
export const DEFAULT_WEIGHT = 1;

// The position of the source tile when app is initialised
export const DEFAULT_START_POS = { row: 1, col: 1 };

// The position of the goal tile when app is initialised
export const DEFAULT_GOAL_POS = { row: HEIGHT - 2, col: WIDTH - 2 };

// Generate a random weight value within the valid bounds
export function genRandomWeight(): number {
  return randomIntBetween(WEIGHT_LOWER_BOUND, WEIGHT_UPPER_BOUND);
}

// Initialise the default GridWeights matrix
export function initBlankGridWeights(): GridWeights {
  return initGenericGrid(HEIGHT, WIDTH, () => DEFAULT_WEIGHT);
}

// Initialise the default GridBarriers matrix
export function initBlankGridBarriers(): GridBarriers {
  return initGenericGrid(HEIGHT, WIDTH, () => false);
}

// Initialise the default GridAnimationFrame before the user has done anything
export function initBlankGridAnimationFrame(): GridAnimationFrame {
  return {
    grid: initGenericGrid(HEIGHT, WIDTH, () => TileAnimationFrame.Blank),
    commentary: 'Nothing has happened yet!',
    gridDists: initGenericGrid(HEIGHT, WIDTH, () => Number.POSITIVE_INFINITY),
    numberOfTilesExpanded: 0,
    numberOfTilesVisited: 0,
    pathLength: 0,
  };
}

export function genNeighbourPositions(
  pos: Pos,
  neighbours: Neighbour[]
): Pos[] {
  return neighbours.map(({ vertical, horizontal }) => {
    return {
      row: pos.row + vertical,
      col: pos.col + horizontal,
    };
  });
}

// Compute the GridPositions matrix
export function initGridPositions(): GridPositions {
  return initGenericGrid(HEIGHT, WIDTH, (row, col) => ({ row, col }));
}

// Return true if a list of positions contains the given position
export function posListHasPos(posList: Pos[], posToCheckFor: Pos): boolean {
  return posList.some((pos) => isSamePos(pos, posToCheckFor));
}

// Return true if two positions are the same
export function isSamePos(pos1: Pos, pos2: Pos): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

// Convert the programmatic representation of a position to a typical (x, y) coordinate representation
export function formatPosForDisplayAsCoord({ row, col }: Pos): string {
  return `(${col + 1}, ${row + 1})`;
}

// Generate a unique id for each position on the grid
export function genUniquePosId(_: number, { row, col }: Pos): number {
  return 0.5 * (row + col) * (row + col + 1) + col;
}

// Generate a unique id for each row on the grid
export function genUniqueRowId(_: number, positions: Pos[]): string {
  return positions.map((pos) => genUniquePosId(_, pos)).toString();
}

export function keepAllNeighbours(neighbours: Neighbour[]): Neighbour[] {
  return neighbours.slice();
}

export function keepDiagonalNeigbours(neighbours: Neighbour[]): Neighbour[] {
  return neighbours.filter(
    ({ vertical, horizontal }) => vertical !== 0 && horizontal !== 0
  );
}

export function keepNonDiagonalNeigbours(neighbours: Neighbour[]): Neighbour[] {
  return neighbours.filter(
    ({ vertical, horizontal }) => vertical === 0 || horizontal === 0
  );
}

// Return true if a position lies within the bounds of the grid
export function isPosOnGrid({ row, col }: Pos): boolean {
  return row >= 0 && row < HEIGHT && col >= 0 && col < WIDTH;
}

// The minimum value a randomly generated weight can be
const WEIGHT_LOWER_BOUND = 2;

// The maximum value a randomly generated weight can be
const WEIGHT_UPPER_BOUND = 30;

// Get the length of a side of the grid in tiles, taking the user's screen dimensions into account
function computeGridLenFromScreenLen(
  screenLen: number,
  modifier: number
): number {
  return Math.round(screenLen / modifier);
}
