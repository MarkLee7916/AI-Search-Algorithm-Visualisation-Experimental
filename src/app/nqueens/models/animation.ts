import cloneDeep from 'clone-deep';
import { Board, genEmptyBoard } from './board';
import {
  VarToDomainMapping,
  initDefaultVarToDomainMapping,
  deepCopyOfVarToDomain,
  initEmptyVarToDomainMapping,
} from './varToDomainMapping';

// A single frame in an animation of the algorithm, encapsulating all the data needed to display what's happening
export type BoardAnimationFrame = {
  board: Board;
  commentary: string;
  rowInConsideration: number | null;
  domainRowToHighlight: number | null;
  varToDomain: VarToDomainMapping;
};

// Initialise the default animation frame
export function initBlankBoardAnimationFrame(
  size: number
): BoardAnimationFrame {
  return {
    board: genEmptyBoard(size),
    commentary: 'Nothing has happened yet!',
    rowInConsideration: null,
    domainRowToHighlight: null,
    varToDomain: initDefaultVarToDomainMapping(size),
  };
}

// Generate an animation frame with forward checking data
export function genBoardAnimationFrameForwardChecking(
  board: Board,
  commentary: string,
  rowInConsideration: number | null,
  domainRowToHighlight: number | null,
  varToDomain: VarToDomainMapping
): BoardAnimationFrame {
  return {
    board: cloneDeep(board),
    commentary,
    rowInConsideration,
    domainRowToHighlight,
    varToDomain: deepCopyOfVarToDomain(varToDomain),
  };
}

// Generate an animation frame without forward checking data
export function genBoardAnimationFrame(
  board: Board,
  commentary: string,
  rowInConsideration: number | null
): BoardAnimationFrame {
  return {
    board: cloneDeep(board),
    commentary,
    rowInConsideration,
    domainRowToHighlight: null,
    varToDomain: initEmptyVarToDomainMapping(board.length),
  };
}
