import { initGenericGrid } from 'src/app/shared/genericUtils';
import { HEIGHT, WIDTH } from '../models/grid';

export type Maze = boolean[][];

type Row = boolean[];

export function genRandomMaze(): Maze {
  const densityThreshold = 0.3;
  const maze = genEmptyMaze();

  maze.forEach((row: Row) => fillRowRandomly(row, densityThreshold));

  return maze;
}

export function genFilledGridMaze(): Maze {
  return initGenericGrid(HEIGHT, WIDTH, () => true);
}

function fillRowRandomly(row: Row, densityThreshold: number): void {
  for (let tile = 0; tile < row.length; tile++) {
    if (Math.random() < densityThreshold) {
      row[tile] = true;
    }
  }
}

function genEmptyMaze(): Maze {
  return initGenericGrid(HEIGHT, WIDTH, () => false);
}
