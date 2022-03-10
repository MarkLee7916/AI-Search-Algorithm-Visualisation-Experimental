import { BoardAnimationFrame } from './animation';
import { Board } from './board';
import { VarToDomainMapping } from './varToDomainMapping';

export type PruningAlgoImpl = (
  varToDomain: VarToDomainMapping,
  board: Board,
  assignedVar: number,
  unassignedVars: number[],
  boardAnimationFrames: BoardAnimationFrame[]
) => VarToDomainMapping;
