import { PriorityQueue, Queue, Stack } from '../models/agendaDataStructures';
import { ObjMap } from '../../shared/models/objMap';
import {
  GenNeighboursImpl,
  GridAnimationFrame,
  GridBarriers,
  GridWeights,
  initBlankGridWeights,
  Pos,
} from '../models/grid';
import { genericUnidirectionalSearch } from './genericPathfindingAlgos';
import {
  genAstarCmp,
  genDijkstraCmp,
  genManhattanCmp,
  genRandomCmp,
} from './cmps';

export type ConcreteAlgoImpl = (
  startPos: Pos,
  goalPos: Pos,
  gridWeights: GridWeights,
  gridBarriers: GridBarriers,
  genNeighbours: GenNeighboursImpl
) => GridAnimationFrame[];

const blankGridWeights = initBlankGridWeights();

export function unidirectionalBFS(
  startPos: Pos,
  goalPos: Pos,
  _: GridWeights,
  gridBarriers: GridBarriers,
  genNeighbours: GenNeighboursImpl
): GridAnimationFrame[] {
  return genericUnidirectionalSearch(
    startPos,
    goalPos,
    new Queue<Pos>(),
    blankGridWeights,
    gridBarriers,
    genNeighbours,
    new ObjMap<Pos, number>([])
  );
}

export function unidirectionalDFS(
  startPos: Pos,
  goalPos: Pos,
  _: GridWeights,
  gridBarriers: GridBarriers,
  genNeighbours: GenNeighboursImpl
): GridAnimationFrame[] {
  return genericUnidirectionalSearch(
    startPos,
    goalPos,
    new Stack<Pos>(),
    blankGridWeights,
    gridBarriers,
    genNeighbours,
    new ObjMap<Pos, number>([])
  );
}

export function unidirectionalDijkstras(
  startPos: Pos,
  goalPos: Pos,
  gridWeights: GridWeights,
  gridBarriers: GridBarriers,
  genNeighbours: GenNeighboursImpl
): GridAnimationFrame[] {
  const distsMap = new ObjMap<Pos, number>([]);

  return genericUnidirectionalSearch(
    startPos,
    goalPos,
    new PriorityQueue<Pos>(genDijkstraCmp(distsMap)),
    gridWeights,
    gridBarriers,
    genNeighbours,
    distsMap
  );
}

export function unidirectionalAstar(
  startPos: Pos,
  goalPos: Pos,
  gridWeights: GridWeights,
  gridBarriers: GridBarriers,
  genNeighbours: GenNeighboursImpl
): GridAnimationFrame[] {
  const distsMap = new ObjMap<Pos, number>([]);

  return genericUnidirectionalSearch(
    startPos,
    goalPos,
    new PriorityQueue<Pos>(genAstarCmp(distsMap, goalPos)),
    gridWeights,
    gridBarriers,
    genNeighbours,
    distsMap
  );
}

export function unidirectionalGBFS(
  startPos: Pos,
  goalPos: Pos,
  _: GridWeights,
  gridBarriers: GridBarriers,
  genNeighbours: GenNeighboursImpl
): GridAnimationFrame[] {
  const distsMap = new ObjMap<Pos, number>([]);

  return genericUnidirectionalSearch(
    startPos,
    goalPos,
    new PriorityQueue<Pos>(genManhattanCmp(goalPos)),
    blankGridWeights,
    gridBarriers,
    genNeighbours,
    distsMap
  );
}

export function unidirectionalRandom(
  startPos: Pos,
  goalPos: Pos,
  _: GridWeights,
  gridBarriers: GridBarriers,
  genNeighbours: GenNeighboursImpl
): GridAnimationFrame[] {
  const distsMap = new ObjMap<Pos, number>([]);

  return genericUnidirectionalSearch(
    startPos,
    goalPos,
    new PriorityQueue<Pos>(genRandomCmp()),
    blankGridWeights,
    gridBarriers,
    genNeighbours,
    distsMap
  );
}
