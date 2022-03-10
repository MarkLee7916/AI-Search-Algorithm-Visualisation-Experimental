import cloneDeep from 'clone-deep';
import {
  removeItemFromArray,
  sequenceBetween,
  sumNumArray,
} from 'src/app/shared/genericUtils';
import {
  BoardAnimationFrame,
  genBoardAnimationFrameForwardChecking,
  initBlankBoardAnimationFrame,
} from '../models/animation';
import { Board, genEmptyBoard, setQueen } from '../models/board';
import { PruningAlgoImpl } from '../models/pruningAlgoImpl';
import {
  Domain,
  initDefaultVarToDomainMapping,
  VarToDomainMapping,
} from '../models/varToDomainMapping';
import { pruneDomainsForNodeConsistency } from './pruningNodeConsistency';

export function backtrackingWithForwardChecking(
  boardSize: number,
  willTakeLeastConstrainingVal: boolean,
  willTakeMostConstrainedVar: boolean,
  pruningAlgoImpl: PruningAlgoImpl
): BoardAnimationFrame[] {
  const boardAnimationFrames = [initBlankBoardAnimationFrame(boardSize)];
  const unassignedVars = sequenceBetween(0, boardSize);
  const solvedBoard = backtrackingWithForwardCheckingRecurse(
    willTakeLeastConstrainingVal,
    willTakeMostConstrainedVar,
    pruningAlgoImpl,
    initDefaultVarToDomainMapping(boardSize),
    unassignedVars,
    genEmptyBoard(boardSize),
    boardAnimationFrames
  );

  if (solvedBoard === null) {
    boardAnimationFrames.push(
      genBoardAnimationFrameForwardChecking(
        genEmptyBoard(boardSize),
        'No Solution Found!',
        null,
        null,
        initDefaultVarToDomainMapping(boardSize)
      )
    );
  }

  return boardAnimationFrames;
}

function backtrackingWithForwardCheckingRecurse(
  willTakeLeastConstrainingVal: boolean,
  willTakeMostConstrainedVar: boolean,
  pruningAlgoImpl: PruningAlgoImpl,
  varToDomain: VarToDomainMapping,
  unassignedVars: number[],
  board: Board,
  boardAnimationFrames: BoardAnimationFrame[]
): Board | null {
  if (unassignedVars.length === 0) {
    boardAnimationFrames.push(
      genBoardAnimationFrameForwardChecking(
        board,
        'Solution Found!',
        null,
        null,
        varToDomain
      )
    );

    return board;
  }

  const assignedVar = willTakeMostConstrainedVar
    ? getMostConstrainedVar(
        board,
        varToDomain,
        unassignedVars,
        boardAnimationFrames
      )
    : unassignedVars[0];

  const domainOfAssignedVar = willTakeLeastConstrainingVal
    ? sortByLeastConstrainingVal(
        board,
        assignedVar,
        varToDomain,
        unassignedVars
      )
    : [...varToDomain.get(assignedVar)];

  removeItemFromArray(unassignedVars, assignedVar);

  for (const val of domainOfAssignedVar) {
    setQueen(board, assignedVar, val, true);

    boardAnimationFrames.push(
      genBoardAnimationFrameForwardChecking(
        board,
        'Assigning Queen to column...',
        assignedVar,
        null,
        varToDomain
      )
    );

    const prunedVarToDomain = pruningAlgoImpl(
      varToDomain,
      board,
      assignedVar,
      unassignedVars,
      boardAnimationFrames
    );

    boardAnimationFrames.push(
      genBoardAnimationFrameForwardChecking(
        board,
        'Preparing to move to next row...',
        assignedVar,
        null,
        prunedVarToDomain
      )
    );

    const solvedBoard = backtrackingWithForwardCheckingRecurse(
      willTakeLeastConstrainingVal,
      willTakeMostConstrainedVar,
      pruningAlgoImpl,
      prunedVarToDomain,
      unassignedVars,
      cloneDeep(board),
      boardAnimationFrames
    );

    if (solvedBoard !== null) {
      return solvedBoard;
    }

    boardAnimationFrames.push(
      genBoardAnimationFrameForwardChecking(
        board,
        'Assignment has lead to an empty domain in a later row, so no solutions can be generated from this partial configuration',
        assignedVar,
        null,
        prunedVarToDomain
      )
    );

    boardAnimationFrames.push(
      genBoardAnimationFrameForwardChecking(
        board,
        'Resetting domains from pruning done as result of assignment...',
        assignedVar,
        null,
        prunedVarToDomain
      )
    );

    animateDomainsResettingAfterFailedAssignment(
      prunedVarToDomain,
      varToDomain,
      board,
      assignedVar,
      unassignedVars,
      boardAnimationFrames
    );

    boardAnimationFrames.push(
      genBoardAnimationFrameForwardChecking(
        board,
        'Resetting of domains done, moving to next column...',
        assignedVar,
        null,
        varToDomain
      )
    );

    setQueen(board, assignedVar, val, false);
  }

  boardAnimationFrames.push(
    genBoardAnimationFrameForwardChecking(
      board,
      domainOfAssignedVar.length > 0
        ? 'All assignments for this row have failed and there are no more to make, backtracking to previous row...'
        : 'Domain of this row is empty, backtracking to previous row...',
      assignedVar,
      assignedVar,
      varToDomain
    )
  );

  unassignedVars.unshift(assignedVar);
  unassignedVars.sort((x, y) => x - y);

  return null;
}

function animateDomainsResettingAfterFailedAssignment(
  prunedVarToDomain: VarToDomainMapping,
  varToDomain: VarToDomainMapping,
  board: Board,
  assignedVar: number,
  unassignedVars: number[],
  boardAnimationFrames: BoardAnimationFrame[]
): void {
  const prunedVars = [assignedVar].concat(unassignedVars);

  prunedVars.forEach((prunedVar) => {
    boardAnimationFrames.push(
      genBoardAnimationFrameForwardChecking(
        board,
        `Resetting domains after failed assignment for row ${prunedVar + 1}...`,
        assignedVar,
        prunedVar,
        prunedVarToDomain
      )
    );

    prunedVarToDomain.set(prunedVar, varToDomain.get(prunedVar));

    boardAnimationFrames.push(
      genBoardAnimationFrameForwardChecking(
        board,
        `Resetting domains after failed assignment for row ${
          prunedVar + 1
        }... done`,
        assignedVar,
        prunedVar,
        prunedVarToDomain
      )
    );
  });
}

function sortByLeastConstrainingVal(
  board: Board,
  assignedVar: number,
  varToDomain: VarToDomainMapping,
  unassignedVars: number[]
): Domain {
  const cmp = (val1: number, val2: number) =>
    getTotalDomainSizeAfterPruning(
      val2,
      board,
      assignedVar,
      varToDomain,
      unassignedVars
    ) -
    getTotalDomainSizeAfterPruning(
      val1,
      board,
      assignedVar,
      varToDomain,
      unassignedVars
    );

  return [...varToDomain.get(assignedVar)].sort(cmp);
}

function getTotalDomainSizeAfterPruning(
  val: number,
  board: Board,
  assignedVar: number,
  varToDomain: VarToDomainMapping,
  unassignedVars: number[]
): number {
  const boardCopy = cloneDeep(board);
  const unassignedVarsCopy = [...unassignedVars];

  removeItemFromArray(unassignedVarsCopy, assignedVar);
  setQueen(boardCopy, assignedVar, val, true);

  const prunedVarToDomain = pruneDomainsForNodeConsistency(
    varToDomain,
    boardCopy,
    assignedVar,
    unassignedVarsCopy,
    []
  );

  return unassignedVarsCopy.reduce(
    (total, unassignedVar) =>
      total + sumNumArray(prunedVarToDomain.get(unassignedVar)),
    0
  );
}

function getMostConstrainedVar(
  board: Board,
  varToDomain: VarToDomainMapping,
  unassignedVars: number[],
  boardAnimationFrames: BoardAnimationFrame[]
): number {
  let smallestDomainLength = Number.POSITIVE_INFINITY;
  let mostConstrainedVar = unassignedVars[0];

  unassignedVars.forEach((variable) => {
    const domainLength = varToDomain.get(variable).length;

    if (domainLength < smallestDomainLength) {
      smallestDomainLength = domainLength;
      mostConstrainedVar = variable;
    }
  });

  boardAnimationFrames.push(
    genBoardAnimationFrameForwardChecking(
      board,
      `Selecting unassigned row with smallest domain... ${
        mostConstrainedVar + 1
      } `,
      null,
      null,
      varToDomain
    )
  );

  return mostConstrainedVar;
}
