import cloneDeep from 'clone-deep';
import { removeItemFromArray } from 'src/app/shared/genericUtils';
import {
  BoardAnimationFrame,
  genBoardAnimationFrameForwardChecking,
} from '../models/animation';
import { Board, isValidQueenPlacement } from '../models/board';
import {
  deepCopyOfVarToDomain,
  VarToDomainMapping,
} from '../models/varToDomainMapping';

// Prune the domain of all the remaining variables after an assignment
export function pruneDomainsForNodeConsistency(
  varToDomain: VarToDomainMapping,
  board: Board,
  assignedVar: number,
  unassignedVars: number[],
  boardAnimationFrames: BoardAnimationFrame[]
): VarToDomainMapping {
  const prunedVarToDomain = deepCopyOfVarToDomain(varToDomain);
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

  unassignedVars.forEach((prunedVar) => {
    const valsToIterateOver = varToDomain.get(prunedVar);

    boardAnimationFrames.push(
      genBoardAnimationFrameForwardChecking(
        board,
        `Starting to prune domain of row ${prunedVar + 1}...`,
        assignedVar,
        prunedVar,
        prunedVarToDomain
      )
    );

    for (const val of valsToIterateOver) {
      if (!isValidQueenPlacement(board, prunedVar, val)) {
        removeItemFromArray(prunedVarToDomain.get(prunedVar), val);
      }
    }

    boardAnimationFrames.push(
      genBoardAnimationFrameForwardChecking(
        board,
        `Pruning domain of row ${prunedVar + 1}... done`,
        assignedVar,
        prunedVar,
        prunedVarToDomain
      )
    );
  });

  return prunedVarToDomain;
}
