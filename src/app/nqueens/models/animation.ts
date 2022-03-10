import cloneDeep from 'clone-deep';
import { Board, genEmptyBoard } from './board';
import {
  VarToDomainMapping,
  initDefaultVarToDomainMapping,
  deepCopyOfVarToDomain,
  initEmptyVarToDomainMapping,
} from './varToDomainMapping';

export type BoardAnimationFrame = {
  board: Board;
  commentary: string;
  rowInConsideration: number | null;
  domainRowToHighlight: number | null;
  varToDomain: VarToDomainMapping;
};

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
