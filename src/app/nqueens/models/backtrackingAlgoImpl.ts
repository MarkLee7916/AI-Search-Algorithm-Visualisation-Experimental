import { BoardAnimationFrame } from './animation';
import { PruningAlgoImpl } from './pruningAlgoImpl';

export type BacktrackingAlgoImpl = (
  boardSize: number,
  willTakeLeastConstrainingVal: boolean,
  willTakeMostConstrainedVar: boolean,
  pruningAlgoImpl: PruningAlgoImpl
) => BoardAnimationFrame[];
