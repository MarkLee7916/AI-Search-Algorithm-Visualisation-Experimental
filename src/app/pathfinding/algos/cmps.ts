import { ObjMap } from '../../shared/models/objMap';
import { Pos } from '../models/grid';

export type Cmp<T> = (item1: T, item2: T) => number;

export function genRandomCmp(): Cmp<Pos> {
  return () => Math.random() - 0.51;
}

export function genDijkstraCmp(distsMap: ObjMap<Pos, number>): Cmp<Pos> {
  return (pos1: Pos, pos2: Pos) => {
    const pos1Dist = distsMap.get(pos1);
    const pos2Dist = distsMap.get(pos2);

    if (pos1Dist === undefined) {
      return -1;
    } else if (pos2Dist === undefined) {
      return 1;
    } else {
      return pos1Dist - pos2Dist;
    }
  };
}

export function genAstarCmp(
  distsMap: ObjMap<Pos, number>,
  goalPos: Pos
): Cmp<Pos> {
  const dijkstraCmp = genDijkstraCmp(distsMap);
  const manhattanCmp = genManhattanCmp(goalPos);

  return (pos1: Pos, pos2: Pos) =>
    dijkstraCmp(pos1, pos2) + manhattanCmp(pos1, pos2);
}

export function genManhattanCmp(goalPos: Pos): Cmp<Pos> {
  return (pos1: Pos, pos2: Pos) =>
    computeManhattanDist(pos1, goalPos) - computeManhattanDist(pos2, goalPos);
}

export function computeManhattanDist(
  { row, col }: Pos,
  { row: goalRow, col: goalCol }: Pos
): number {
  return Math.abs(row - goalRow) + Math.abs(col - goalCol);
}
