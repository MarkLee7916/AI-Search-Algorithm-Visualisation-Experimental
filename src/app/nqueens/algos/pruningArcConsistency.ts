import cloneDeep from 'clone-deep';
import { assertDefined } from 'src/app/shared/genericUtils';
import {
  BoardAnimationFrame,
  genBoardAnimationFrameForwardChecking,
} from '../models/animation';
import { Board, setQueen, isValidQueenPlacement } from '../models/board';
import {
  VarToDomainMapping,
  deepCopyOfVarToDomain,
  areDomainsEqual,
  Domain,
} from '../models/varToDomainMapping';

type Arc = {
  varPruned: number;
  varRespected: number;
  constraint: Constraint;
};

type Constraint = (valPruned: number, valRespected: number) => boolean;

export function pruneDomainsForArcConsistency(
  varToDomain: VarToDomainMapping,
  board: Board,
  assignedVar: number,
  unassignedVars: number[],
  boardAnimationFrames: BoardAnimationFrame[]
): VarToDomainMapping {
  const prunedVarToDomain = deepCopyOfVarToDomain(varToDomain);
  const arcQueue = genArcQueue(board, assignedVar, unassignedVars);
  const valAssigned = board[assignedVar].indexOf(true);

  boardAnimationFrames.push(
    genBoardAnimationFrameForwardChecking(
      cloneDeep(board),
      `Starting to prune domain of assigned row - row ${assignedVar + 1}...`,
      assignedVar,
      assignedVar,
      prunedVarToDomain
    )
  );

  prunedVarToDomain.set(assignedVar, [valAssigned]);

  boardAnimationFrames.push(
    genBoardAnimationFrameForwardChecking(
      cloneDeep(board),
      `Pruning domain of assigned row - row ${assignedVar + 1}... done`,
      assignedVar,
      assignedVar,
      prunedVarToDomain
    )
  );

  while (arcQueue.length > 0) {
    const arc = assertDefined(arcQueue.shift());
    const domainToPrune = prunedVarToDomain.get(arc.varPruned);
    const domainRespected = prunedVarToDomain.get(arc.varRespected);

    boardAnimationFrames.push(
      genBoardAnimationFrameForwardChecking(
        cloneDeep(board),
        `Pruning domain of row ${arc.varPruned + 1} with respect to row ${
          arc.varRespected + 1
        }...`,
        assignedVar,
        arc.varPruned,
        prunedVarToDomain
      )
    );

    const domainAfterPruning = pruneDomain(
      domainToPrune,
      domainRespected,
      arc.constraint
    );

    prunedVarToDomain.set(arc.varPruned, domainAfterPruning);

    boardAnimationFrames.push(
      genBoardAnimationFrameForwardChecking(
        board,
        `Pruning domain of row ${arc.varPruned + 1} with respect to row ${
          arc.varRespected + 1
        }... done`,
        assignedVar,
        arc.varPruned,
        prunedVarToDomain
      )
    );

    if (!areDomainsEqual(domainToPrune, domainAfterPruning)) {
      getAffectedArcsFromPrune(arc.varPruned, arcQueue).forEach(
        (affectedArc) => {
          arcQueue.push(affectedArc);
        }
      );
    }
  }

  return prunedVarToDomain;
}

function getAffectedArcsFromPrune(varPruned: number, arcQueue: Arc[]): Arc[] {
  return getArcsWithRespectToPrunedVar(varPruned, arcQueue).filter(
    (arcWithRespectToPrunedVar) =>
      !arcQueue.some(
        (arcInQueue) =>
          arcInQueue.varPruned === arcWithRespectToPrunedVar.varPruned &&
          arcInQueue.varRespected === arcWithRespectToPrunedVar.varRespected
      )
  );
}

function getArcsWithRespectToPrunedVar(
  varPruned: number,
  arcQueue: Arc[]
): Arc[] {
  return arcQueue.filter((arc) => arc.varRespected === varPruned);
}

function genArcQueue(
  board: Board,
  assignedVar: number,
  unassignedVars: number[]
): Arc[] {
  const arcQueue: Arc[] = [];
  const varsToUse = unassignedVars.concat(assignedVar);

  for (let varI = 0; varI < board.length; varI++) {
    for (let varJ = varI + 1; varJ < board.length; varJ++) {
      if (varsToUse.includes(varI) && varsToUse.includes(varJ)) {
        arcQueue.push({
          varPruned: varI,
          varRespected: varJ,
          constraint: genConstraintFunction(varI, varJ, board),
        });

        arcQueue.push({
          varPruned: varJ,
          varRespected: varI,
          constraint: genConstraintFunction(varJ, varI, board),
        });
      }
    }
  }

  return arcQueue;
}

function genConstraintFunction(
  varToPrune: number,
  varRespected: number,
  board: Board
): Constraint {
  return (valToPotentiallyPrune: number, valRespected: number) => {
    const boardCopy = cloneDeep(board);

    setQueen(boardCopy, varToPrune, valToPotentiallyPrune, true);
    setQueen(boardCopy, varRespected, valRespected, true);

    return (
      isValidQueenPlacement(boardCopy, varToPrune, valToPotentiallyPrune) &&
      isValidQueenPlacement(boardCopy, varRespected, valRespected)
    );
  };
}

function pruneDomain(
  domainToPrune: Domain,
  domainRespected: Domain,
  constraint: Constraint
): Domain {
  const valsToPrune = new Set<number>();

  domainToPrune.forEach((valToPotentiallyPrune) => {
    if (!canDomainSatisfy(valToPotentiallyPrune, domainRespected, constraint)) {
      valsToPrune.add(valToPotentiallyPrune);
    }
  });

  return domainToPrune.filter((val) => !valsToPrune.has(val));
}

function canDomainSatisfy(
  valToPotentiallyPrune: number,
  domainRespected: Domain,
  constraint: Constraint
): boolean {
  return domainRespected.some((valRespected) =>
    constraint(valToPotentiallyPrune, valRespected)
  );
}
