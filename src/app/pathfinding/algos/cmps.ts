import { ObjMap } from '../../shared/models/objMap';
import { Pos } from '../models/grid';

/*
 A comparator function that given two items, returns a result such that: 
   item 1 > item 2 => result > 0, 
   item1 == item2 => result = 0, 
   item1 < item2 => result < 0
*/
export type Cmp<T> = (item1: T, item2: T) => number;

// Generate a comparator that ignore its inputs and returns a random number between -0.5 and 0.5
export function genRandomCmp(): Cmp<Pos> {
  return () => Math.random() - 0.51;
}

// Generate a comparator that compares two nodes using the distance from the source node
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

// Generate a comparator that compares two nodes using (dist from source + manhattan dist to target)
export function genAstarCmp(
  distsMap: ObjMap<Pos, number>,
  goalPos: Pos
): Cmp<Pos> {
  const dijkstraCmp = genDijkstraCmp(distsMap);
  const manhattanCmp = genManhattanCmp(goalPos);

  return (pos1: Pos, pos2: Pos) =>
    dijkstraCmp(pos1, pos2) + manhattanCmp(pos1, pos2);
}

// Generate a comparator that compares two nodes using the manhattan distance
export function genManhattanCmp(goalPos: Pos): Cmp<Pos> {
  return (pos1: Pos, pos2: Pos) =>
    computeManhattanDist(pos1, goalPos) - computeManhattanDist(pos2, goalPos);
}

// Return the manhattan distance between two (x, y) coordinates 
export function computeManhattanDist(
  { row, col }: Pos,
  { row: goalRow, col: goalCol }: Pos
): number {
  return Math.abs(row - goalRow) + Math.abs(col - goalCol);
}
