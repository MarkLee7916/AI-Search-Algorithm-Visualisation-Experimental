import { initGenericGrid } from 'src/app/shared/genericUtils';
import { HEIGHT, Pos, WIDTH } from './grid';

// A case to question the user on
export type QuizCase = {
  gridWeights: number[][];
  gridBarriers: boolean[][];
  startPos: Pos;
  goalPos: Pos;
};

// Set up an unambigious case to test the user on Dijkstra's
export function genDijsktraQuizCase(): QuizCase {
  const gridWeights = initGenericGrid(HEIGHT, WIDTH, () => 1);
  const gridBarriers = initGenericGrid(HEIGHT, WIDTH, () => false);

  gridWeights[0][1] = 19;
  gridWeights[0][2] = 6;
  gridWeights[0][4] = 25;
  gridWeights[0][5] = 27;
  gridWeights[0][6] = 27;
  gridWeights[0][7] = 18;
  gridWeights[0][8] = 15;

  gridWeights[1][2] = 28;
  gridWeights[1][4] = 5;
  gridWeights[1][5] = 29;
  gridWeights[1][6] = 20;
  gridWeights[1][7] = 19;
  gridWeights[1][8] = 10;

  gridWeights[2][1] = 7;
  gridWeights[2][2] = 13;
  gridWeights[2][4] = 14;
  gridWeights[2][5] = 7;
  gridWeights[2][6] = 19;
  gridWeights[2][7] = 3;
  gridWeights[2][8] = 14;

  gridBarriers[0][0] = true;
  gridBarriers[1][0] = true;
  gridBarriers[2][0] = true;
  gridBarriers[3][0] = true;
  gridBarriers[3][1] = true;
  gridBarriers[3][2] = true;
  gridBarriers[3][3] = true;
  gridBarriers[3][4] = true;
  gridBarriers[3][5] = true;
  gridBarriers[3][6] = true;
  gridBarriers[3][7] = true;
  gridBarriers[3][8] = true;
  gridBarriers[3][9] = true;
  gridBarriers[3][10] = true;
  gridBarriers[2][10] = true;
  gridBarriers[1][10] = true;
  gridBarriers[0][10] = true;

  return {
    gridBarriers,
    gridWeights,
    startPos: { row: 1, col: 1 },
    goalPos: { row: 1, col: 9 },
  };
}

// Set up an unambigious case to test the user on A*
export function genAstarQuizCase(): QuizCase {
  const gridWeights = initGenericGrid(HEIGHT, WIDTH, () => 1);
  const gridBarriers = initGenericGrid(HEIGHT, WIDTH, () => false);

  gridWeights[0][2] = 14;
  gridWeights[0][3] = 15;
  gridWeights[0][4] = 13;

  gridWeights[1][1] = 21;
  gridWeights[1][4] = 15;
  gridWeights[1][5] = 9;

  gridWeights[2][2] = 10;
  gridWeights[2][3] = 2;
  gridWeights[2][4] = 10;
  gridWeights[2][7] = 19;

  gridBarriers[0][0] = true;
  gridBarriers[1][0] = true;
  gridBarriers[2][0] = true;
  gridBarriers[3][0] = true;
  gridBarriers[3][1] = true;
  gridBarriers[3][2] = true;
  gridBarriers[3][3] = true;
  gridBarriers[3][4] = true;
  gridBarriers[3][5] = true;
  gridBarriers[3][6] = true;
  gridBarriers[3][7] = true;
  gridBarriers[3][8] = true;
  gridBarriers[3][9] = true;
  gridBarriers[3][10] = true;
  gridBarriers[2][10] = true;
  gridBarriers[1][10] = true;
  gridBarriers[0][10] = true;

  return {
    gridBarriers,
    gridWeights,
    startPos: { row: 1, col: 3 },
    goalPos: { row: 1, col: 9 },
  };
}

// Set up an unambigious case to test the user on Greedy best first search
export function genGBFSQuizCase(): QuizCase {
  return {
    gridBarriers: initGenericGrid(HEIGHT, WIDTH, () => false),
    gridWeights: initGenericGrid(HEIGHT, WIDTH, () => 1),
    startPos: { row: 1, col: 1 },
    goalPos: { row: 1, col: 9 },
  };
}
