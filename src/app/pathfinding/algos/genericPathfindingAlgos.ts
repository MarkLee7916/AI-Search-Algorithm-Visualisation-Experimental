import { Agenda } from '../models/agendaDataStructures';
import {
  formatPosForDisplayAsCoord,
  GenNeighboursImpl,
  GridAnimationFrame,
  GridBarriers,
  GridWeights,
  HEIGHT,
  initBlankGridAnimationFrame,
  isPosOnGrid,
  isSamePos,
  Pos,
  posListHasPos,
  TileAnimationFrame,
  WIDTH,
} from '../models/grid';
import { ObjMap } from '../../shared/models/objMap';
import { assertDefined, initGenericGrid } from '../../shared/genericUtils';

// A generic search function parameterised with a data structure, i.e passing a queue turns this into a BFS
export function genericUnidirectionalSearch(
  startPos: Pos,
  goalPos: Pos,
  agenda: Agenda<Pos>,
  gridWeights: GridWeights,
  gridBarriers: GridBarriers,
  genNeighbours: GenNeighboursImpl,
  distsMap: ObjMap<Pos, number>
): GridAnimationFrame[] {
  const pathMap = new ObjMap<Pos, Pos>([]);
  const gridExpanded = initGenericGrid(HEIGHT, WIDTH, () => false);
  const gridVisited = initGenericGrid(HEIGHT, WIDTH, () => false);
  const gridAnimationFrames = [initBlankGridAnimationFrame()];

  distsMap.set(startPos, 0);
  gridVisited[startPos.row][startPos.col] = true;
  agenda.add(startPos);

  while (!agenda.isEmpty()) {
    const pos = agenda.remove();

    gridExpanded[pos.row][pos.col] = true;

    gridAnimationFrames.push(
      genGridAnimationFrame(
        gridExpanded,
        gridVisited,
        convertDistsMapToGridDists(distsMap),
        pos,
        [],
        [],
        `Starting to expand ${formatPosForDisplayAsCoord(pos)}`
      )
    );

    if (isSamePos(pos, goalPos)) {
      updateGridAnimationFramesWithFinalPath(
        gridExpanded,
        gridVisited,
        convertDistsMapToGridDists(distsMap),
        pathMap,
        goalPos,
        gridAnimationFrames
      );

      return gridAnimationFrames;
    }

    const validNeighbours = genNeighbours(pos).filter(
      (neighPos) =>
        isPosOnGrid(neighPos) && !gridBarriers[neighPos.row][neighPos.col]
    );

    const validUnvisitedNeighbours = validNeighbours.filter(
      ({ row, col }) => !gridVisited[row][col]
    );

    validNeighbours.forEach((neighPos) => {
      const { row: neighRow, col: neighCol } = neighPos;
      const neighDist =
        assertDefined(distsMap.get(pos)) + gridWeights[neighRow][neighCol];

      if (!gridVisited[neighRow][neighCol]) {
        agenda.add(neighPos);
        gridVisited[neighRow][neighCol] = true;
        distsMap.set(neighPos, neighDist);
        pathMap.set(neighPos, pos);
      } else if (neighDist < assertDefined(distsMap.get(neighPos))) {
        distsMap.set(neighPos, neighDist);
        pathMap.set(neighPos, pos);
      }
    });

    const addingNeighboursCommentary = `Adding unvisited neighbours of ${formatPosForDisplayAsCoord(
      pos
    )} to agenda ... ${validUnvisitedNeighbours.length} found`;

    gridAnimationFrames.push(
      genGridAnimationFrame(
        gridExpanded,
        gridVisited,
        convertDistsMapToGridDists(distsMap),
        pos,
        validUnvisitedNeighbours,
        [],
        addingNeighboursCommentary
      )
    );
  }

  gridAnimationFrames.push(
    genGridAnimationFrame(
      gridExpanded,
      gridVisited,
      convertDistsMapToGridDists(distsMap),
      null,
      [],
      [],
      'No path found!'
    )
  );

  return gridAnimationFrames;
}

// When algo is finished, animate generation of final path using the pathMap mapping
function updateGridAnimationFramesWithFinalPath(
  gridExpanded: boolean[][],
  gridVisited: boolean[][],
  gridDists: number[][],
  pathMap: ObjMap<Pos, Pos>,
  goalPos: Pos,
  gridAnimationFrames: GridAnimationFrame[]
): Pos[] {
  const pathList = [goalPos];
  let currPos = goalPos;

  while (pathMap.get(currPos) !== undefined) {
    currPos = pathMap.get(currPos) as Pos;
    pathList.push(currPos);
    gridAnimationFrames.push(
      genGridAnimationFrame(
        gridExpanded,
        gridVisited,
        gridDists,
        null,
        [],
        pathList,
        'Path found!'
      )
    );
  }

  return pathList.reverse();
}

// Convert a distsMap where a tile is mapped onto its dist to a grid where a tiles pos corresponds to its dist
function convertDistsMapToGridDists(distsMap: ObjMap<Pos, number>): number[][] {
  const gridDists = initGenericGrid(
    HEIGHT,
    WIDTH,
    () => Number.POSITIVE_INFINITY
  );

  for (let row = 0; row < HEIGHT; row++) {
    for (let col = 0; col < WIDTH; col++) {
      const dist = distsMap.get({ row, col });

      if (dist !== undefined) {
        gridDists[row][col] = dist;
      }
    }
  }

  return gridDists;
}

// Given info about the current state of the search, generate an animation frame
function genGridAnimationFrame(
  gridExpanded: boolean[][],
  gridVisited: boolean[][],
  gridDists: number[][],
  posBeingExpanded: Pos | null,
  positionsBeingAddedToAgenda: Pos[],
  pathList: Pos[],
  commentary: string
): GridAnimationFrame {
  const gridAnimationFrames = initBlankGridAnimationFrame();

  gridAnimationFrames.commentary = commentary;
  gridAnimationFrames.gridDists = gridDists;

  for (let row = 0; row < HEIGHT; row++) {
    for (let col = 0; col < WIDTH; col++) {
      const pos = { row, col };

      if (posListHasPos(pathList, pos)) {
        gridAnimationFrames.grid[row][col] = TileAnimationFrame.FinalPath;
      } else if (posBeingExpanded && isSamePos(posBeingExpanded, pos)) {
        gridAnimationFrames.grid[row][col] = TileAnimationFrame.BeingExpanded;
      } else if (posListHasPos(positionsBeingAddedToAgenda, pos)) {
        gridAnimationFrames.grid[row][col] =
          TileAnimationFrame.BeingAddedToAgenda;
      } else if (gridExpanded[row][col]) {
        gridAnimationFrames.grid[row][col] = TileAnimationFrame.Expanded;
      } else if (gridVisited[row][col]) {
        gridAnimationFrames.grid[row][col] = TileAnimationFrame.Visited;
      }
    }
  }

  return gridAnimationFrames;
}
