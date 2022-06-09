import {
  DEFAULT_GOAL_POS,
  DEFAULT_START_POS,
  genDiagonalNeighboursFunction,
  genNonDiagonalNeighboursFunction,
  HEIGHT,
  initBlankGridBarriers,
  initBlankGridWeights,
  TileAnimationFrame,
  WIDTH,
} from '../models/grid';
import { genAstarQuizCase, genDijsktraQuizCase } from '../models/quizCases';
import {
  unidirectionalAstar,
  unidirectionalBFS,
  unidirectionalDFS,
  unidirectionalDijkstras,
  unidirectionalGBFS,
  unidirectionalRandom,
} from './conretePathfindingAlgos';

describe('Concrete Pathfinding Algorithms', () => {
  describe('dijkstra', () => {
    it('finds the shortest weighted path for dijkstra quiz case', () => {
      const testcase = genDijsktraQuizCase();

      const output = unidirectionalDijkstras(
        testcase.startPos,
        testcase.goalPos,
        testcase.gridWeights,
        testcase.gridBarriers,
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.grid[1][1]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][1]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][2]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][3]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][4]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][5]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][6]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][7]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][8]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][9]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[1][9]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[1][9]).toEqual(80);
    });

    it('finds the shortest weighted path for A* quiz case', () => {
      const testcase = genAstarQuizCase();

      const output = unidirectionalDijkstras(
        testcase.startPos,
        testcase.goalPos,
        testcase.gridWeights,
        testcase.gridBarriers,
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.grid[1][3]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][3]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][4]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][5]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][6]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[1][6]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[1][7]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[1][8]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[1][9]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.gridDists[1][3]).toEqual(0);
      expect(finalFrame.gridDists[1][9]).toEqual(18);
    });

    it('finds the shortest unweighted path for default case', () => {
      const output = unidirectionalDijkstras(
        DEFAULT_START_POS,
        DEFAULT_GOAL_POS,
        initBlankGridWeights(),
        initBlankGridBarriers(),
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[HEIGHT - 2][WIDTH - 2]).toEqual(
        HEIGHT + WIDTH - 6
      );
    });

    it('does not find a path when blocked', () => {
      const gridBarriers = initBlankGridBarriers();

      gridBarriers[1][0] = true;
      gridBarriers[0][1] = true;
      gridBarriers[1][2] = true;
      gridBarriers[2][1] = true;

      const output = unidirectionalDijkstras(
        DEFAULT_START_POS,
        DEFAULT_GOAL_POS,
        initBlankGridWeights(),
        gridBarriers,
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[HEIGHT - 2][WIDTH - 2]).toEqual(
        Number.POSITIVE_INFINITY
      );
    });

    it('does not find a path when in diagonal neighbours mode and goal should not be reachable diagonally', () => {
      const output = unidirectionalDijkstras(
        { row: 1, col: 1 },
        { row: 1, col: 8 },
        initBlankGridWeights(),
        initBlankGridBarriers(),
        genDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[1][8]).toEqual(Number.POSITIVE_INFINITY);
    });
  });

  describe('A*', () => {
    it('finds the shortest weighted path for dijkstra quiz case', () => {
      const testcase = genDijsktraQuizCase();

      const output = unidirectionalAstar(
        testcase.startPos,
        testcase.goalPos,
        testcase.gridWeights,
        testcase.gridBarriers,
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.grid[1][1]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][1]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][2]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][3]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][4]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][5]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][6]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][7]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][8]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][9]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[1][9]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[1][9]).toEqual(80);
    });

    it('finds the shortest weighted path for A* quiz case', () => {
      const testcase = genAstarQuizCase();

      const output = unidirectionalAstar(
        testcase.startPos,
        testcase.goalPos,
        testcase.gridWeights,
        testcase.gridBarriers,
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.grid[1][3]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][3]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][4]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][5]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[2][6]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[1][6]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[1][7]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[1][8]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.grid[1][9]).toEqual(TileAnimationFrame.FinalPath);
      expect(finalFrame.gridDists[1][3]).toEqual(0);
      expect(finalFrame.gridDists[1][9]).toEqual(18);
    });

    it('finds the shortest unweighted path for default case', () => {
      const output = unidirectionalAstar(
        DEFAULT_START_POS,
        DEFAULT_GOAL_POS,
        initBlankGridWeights(),
        initBlankGridBarriers(),
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[HEIGHT - 2][WIDTH - 2]).toEqual(
        HEIGHT + WIDTH - 6
      );
    });

    it('does not find a path when blocked', () => {
      const gridBarriers = initBlankGridBarriers();

      gridBarriers[1][0] = true;
      gridBarriers[0][1] = true;
      gridBarriers[1][2] = true;
      gridBarriers[2][1] = true;

      const output = unidirectionalAstar(
        DEFAULT_START_POS,
        DEFAULT_GOAL_POS,
        initBlankGridWeights(),
        gridBarriers,
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[HEIGHT - 2][WIDTH - 2]).toEqual(
        Number.POSITIVE_INFINITY
      );
    });

    it('does not find a path when in diagonal neighbours mode and goal should not be reachable diagonally', () => {
      const output = unidirectionalAstar(
        { row: 1, col: 1 },
        { row: 1, col: 8 },
        initBlankGridWeights(),
        initBlankGridBarriers(),
        genDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[1][8]).toEqual(Number.POSITIVE_INFINITY);
    });
  });

  describe('BFS', () => {
    it('finds the shortest unweighted path for default case', () => {
      const output = unidirectionalBFS(
        DEFAULT_START_POS,
        DEFAULT_GOAL_POS,
        initBlankGridWeights(),
        initBlankGridBarriers(),
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[HEIGHT - 2][WIDTH - 2]).toEqual(
        HEIGHT + WIDTH - 6
      );
    });

    it('does not find a path when blocked', () => {
      const gridBarriers = initBlankGridBarriers();

      gridBarriers[1][0] = true;
      gridBarriers[0][1] = true;
      gridBarriers[1][2] = true;
      gridBarriers[2][1] = true;

      const output = unidirectionalBFS(
        DEFAULT_START_POS,
        DEFAULT_GOAL_POS,
        initBlankGridWeights(),
        gridBarriers,
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[HEIGHT - 2][WIDTH - 2]).toEqual(
        Number.POSITIVE_INFINITY
      );
    });

    it('does not find a path when in diagonal neighbours mode and goal should not be reachable diagonally', () => {
      const output = unidirectionalBFS(
        { row: 1, col: 1 },
        { row: 1, col: 8 },
        initBlankGridWeights(),
        initBlankGridBarriers(),
        genDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[1][8]).toEqual(Number.POSITIVE_INFINITY);
    });
  });

  describe('DFS', () => {
    it('does not find a path when blocked', () => {
      const gridBarriers = initBlankGridBarriers();

      gridBarriers[1][0] = true;
      gridBarriers[0][1] = true;
      gridBarriers[1][2] = true;
      gridBarriers[2][1] = true;

      const output = unidirectionalDFS(
        DEFAULT_START_POS,
        DEFAULT_GOAL_POS,
        initBlankGridWeights(),
        gridBarriers,
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[HEIGHT - 2][WIDTH - 2]).toEqual(
        Number.POSITIVE_INFINITY
      );
    });

    it('does not find a path when in diagonal neighbours mode and goal should not be reachable diagonally', () => {
      const output = unidirectionalDFS(
        { row: 1, col: 1 },
        { row: 1, col: 8 },
        initBlankGridWeights(),
        initBlankGridBarriers(),
        genDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[1][8]).toEqual(Number.POSITIVE_INFINITY);
    });

    it('finds a path for default case', () => {
      const output = unidirectionalDFS(
        DEFAULT_START_POS,
        DEFAULT_GOAL_POS,
        initBlankGridWeights(),
        initBlankGridBarriers(),
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.grid[HEIGHT - 2][WIDTH - 2]).toEqual(
        TileAnimationFrame.FinalPath
      );
    });
  });

  describe('GBFS', () => {
    it('does not find a path when blocked', () => {
      const gridBarriers = initBlankGridBarriers();

      gridBarriers[1][0] = true;
      gridBarriers[0][1] = true;
      gridBarriers[1][2] = true;
      gridBarriers[2][1] = true;

      const output = unidirectionalGBFS(
        DEFAULT_START_POS,
        DEFAULT_GOAL_POS,
        initBlankGridWeights(),
        gridBarriers,
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[HEIGHT - 2][WIDTH - 2]).toEqual(
        Number.POSITIVE_INFINITY
      );
    });

    it('does not find a path when in diagonal neighbours mode and goal should not be reachable diagonally', () => {
      const output = unidirectionalGBFS(
        { row: 1, col: 1 },
        { row: 1, col: 8 },
        initBlankGridWeights(),
        initBlankGridBarriers(),
        genDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[1][8]).toEqual(Number.POSITIVE_INFINITY);
    });

    it('finds a path for default case', () => {
      const output = unidirectionalGBFS(
        DEFAULT_START_POS,
        DEFAULT_GOAL_POS,
        initBlankGridWeights(),
        initBlankGridBarriers(),
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.grid[HEIGHT - 2][WIDTH - 2]).toEqual(
        TileAnimationFrame.FinalPath
      );
    });
  });

  describe('random search', () => {
    it('does not find a path when blocked', () => {
      const gridBarriers = initBlankGridBarriers();

      gridBarriers[1][0] = true;
      gridBarriers[0][1] = true;
      gridBarriers[1][2] = true;
      gridBarriers[2][1] = true;

      const output = unidirectionalRandom(
        DEFAULT_START_POS,
        DEFAULT_GOAL_POS,
        initBlankGridWeights(),
        gridBarriers,
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[HEIGHT - 2][WIDTH - 2]).toEqual(
        Number.POSITIVE_INFINITY
      );
    });

    it('does not find a path when in diagonal neighbours mode and goal should not be reachable diagonally', () => {
      const output = unidirectionalRandom(
        { row: 1, col: 1 },
        { row: 1, col: 8 },
        initBlankGridWeights(),
        initBlankGridBarriers(),
        genDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.gridDists[1][8]).toEqual(Number.POSITIVE_INFINITY);
    });

    it('finds a path for default case', () => {
      const output = unidirectionalRandom(
        DEFAULT_START_POS,
        DEFAULT_GOAL_POS,
        initBlankGridWeights(),
        initBlankGridBarriers(),
        genNonDiagonalNeighboursFunction
      );

      const finalFrame = output[output.length - 1];

      expect(finalFrame.gridDists[1][1]).toEqual(0);
      expect(finalFrame.grid[HEIGHT - 2][WIDTH - 2]).toEqual(
        TileAnimationFrame.FinalPath
      );
    });
  });
});
