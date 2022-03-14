import { Component, OnInit } from '@angular/core';
import {
  assertNonNull,
  AVERAGE_OF_VW_AND_VH,
  getValueFromRangeEvent,
  safeGetArrayIndex,
  wait,
} from 'src/app/shared/genericUtils';
import { UncheckedObjMap } from 'src/app/shared/models/uncheckedObjMap';
import { backtracking } from '../../algos/backtracking';
import { backtrackingWithForwardChecking } from '../../algos/backtrackingForwardChecking';
import { pruneDomainsForArcConsistency } from '../../algos/pruningArcConsistency';
import { pruneDomainsForNodeConsistency } from '../../algos/pruningNodeConsistency';
import {
  initBlankBoardAnimationFrame,
  BoardAnimationFrame,
} from '../../models/animation';
import { BacktrackingAlgoImpl } from '../../models/backtrackingAlgoImpl';
import {
  findQueenColAtRow,
  MAX_BOARD_SIZE,
  MIN_BOARD_SIZE,
  Pos,
} from '../../models/board';
import {
  CheckingItem,
  DomainDisplayItem,
  PruningAlgoItem,
  UserInteractionModeItem,
  ValHeuristicItem,
  VarHeuristicItem,
} from '../../models/dropdownItemEnums';
import { PruningAlgoImpl } from '../../models/pruningAlgoImpl';
import { TutorialModalSlide } from '../tutorial-modal/tutorial-modal.component';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
})
export class PageComponent implements OnInit {
  readonly Modal = Modal;

  readonly MIN_BOARD_SIZE = MIN_BOARD_SIZE;

  readonly MAX_BOARD_SIZE = MAX_BOARD_SIZE;

  readonly BOARD_SIZE_IN_PX = AVERAGE_OF_VW_AND_VH * 0.5;

  readonly tutorialModalSlides = Object.values(TutorialModalSlide);

  readonly pruningAlgoItems = Object.values(PruningAlgoItem);

  readonly varHeuristicItems = Object.values(VarHeuristicItem);

  readonly valHeuristicItems = Object.values(ValHeuristicItem);

  readonly domainDisplayItems = Object.values(DomainDisplayItem);

  readonly checkingItems = Object.values(CheckingItem);

  readonly userInteractionModeItems = Object.values(UserInteractionModeItem);

  readonly pruningAlgoItemToImpl = new UncheckedObjMap<
    PruningAlgoItem,
    PruningAlgoImpl
  >([
    [PruningAlgoItem.Node, pruneDomainsForNodeConsistency],
    [PruningAlgoItem.Arc, pruneDomainsForArcConsistency],
  ]);

  readonly checkingItemToImpl = new UncheckedObjMap<
    CheckingItem,
    BacktrackingAlgoImpl
  >([
    [CheckingItem.Assigning, backtracking],
    [CheckingItem.ForwardChecking, backtrackingWithForwardChecking],
  ]);

  boardSize = 4;

  animationFrames = [initBlankBoardAnimationFrame(this.boardSize)];

  isAnimationRunning = false;

  animationIndex = 0;

  needToUpdateAnimationFrames = true;

  modalDisplayed = Modal.Tutorial;

  pruningAlgoItem = PruningAlgoItem.Node;

  varHeuristicItem = VarHeuristicItem.InOrder;

  valHeuristicItem = ValHeuristicItem.InOrder;

  domainDisplayItem = DomainDisplayItem.All;

  checkingItem = CheckingItem.Assigning;

  userInteractionModeItem = UserInteractionModeItem.Visualise;

  commentaryType = CommentaryType.AlgoStep;

  canClickOnTileIfInQuizMode = true;

  quizDelayMs = 2000;

  ngOnInit(): void {
    this.updateAnimationFramesIfNeeded();
  }

  setAnimationRunning(running: boolean): void {
    this.isAnimationRunning = running;
  }

  setAnimationIndex(index: number): void {
    this.animationIndex = index;
  }

  getCurrentAnimationFrame(): BoardAnimationFrame {
    return this.animationFrames[this.safeGetAnimationIndex()];
  }

  safeGetAnimationIndex(): number {
    return safeGetArrayIndex(this.animationFrames, this.animationIndex);
  }

  hideModal(): void {
    this.modalDisplayed = Modal.None;
  }

  setModalDisplayed(modal: Modal): void {
    this.modalDisplayed = modal;
  }

  updateAnimationFramesIfNeeded(): void {
    const backTrackingAlgoImpl = this.checkingItemToImpl.get(this.checkingItem);

    if (this.needToUpdateAnimationFrames) {
      this.animationFrames = backTrackingAlgoImpl(
        this.boardSize,
        this.valHeuristicItem === ValHeuristicItem.LeastConstraining,
        this.varHeuristicItem === VarHeuristicItem.MostConstrained,
        this.pruningAlgoItemToImpl.get(this.pruningAlgoItem)
      );
    }

    this.needToUpdateAnimationFrames = false;
  }

  setPruningAlgoItem(pruningAlgoItem: string): void {
    this.pruningAlgoItem = pruningAlgoItem as PruningAlgoItem;
    this.markAnimationFramesForUpdate();
  }

  setValHeuristicItem(valHeuristicItem: string): void {
    this.valHeuristicItem = valHeuristicItem as ValHeuristicItem;
    this.markAnimationFramesForUpdate();
  }

  setVarHeuristicItem(varHeuristicItem: string): void {
    this.varHeuristicItem = varHeuristicItem as VarHeuristicItem;
    this.markAnimationFramesForUpdate();
  }

  setDomainDisplayItem(domainDisplayItem: string): void {
    this.domainDisplayItem = domainDisplayItem as DomainDisplayItem;
  }

  setCheckingItem(checkingItem: string): void {
    this.checkingItem = checkingItem as CheckingItem;
    this.markAnimationFramesForUpdate();
  }

  setUserInteractionModeItem(item: string): void {
    this.userInteractionModeItem = item as UserInteractionModeItem;

    if (this.isInQuizMode()) {
      this.commentaryType = CommentaryType.GuessExplanation;
      this.markAnimationFramesForUpdate();
    } else {
      this.commentaryType = CommentaryType.AlgoStep;
    }
  }

  isInQuizMode(): boolean {
    return this.userInteractionModeItem === UserInteractionModeItem.Quiz;
  }

  setBoardSize(event: Event): void {
    this.boardSize = getValueFromRangeEvent(event);
    this.markAnimationFramesForUpdate();
  }

  getRowClass(row: number): string {
    let classStr = 'row';

    if (this.isRowUnderConsideration(row)) {
      classStr += ' opacity-highlight';
      classStr += ' black-border';
    }

    return classStr;
  }

  isTilePrunedFromDomainHighlighted(row: number, col: number): boolean {
    return (
      !this.isTileDomainHighlighted(row, col) && this.isHighlightingDomains()
    );
  }

  isTileDomainHighlighted(row: number, col: number): boolean {
    return (
      this.isRowDomainHighlighted(row) &&
      this.getCurrentAnimationFrame().varToDomain.get(row).includes(col)
    );
  }

  isRowDomainHighlighted(row: number): boolean {
    if (!this.isHighlightingDomains()) {
      return false;
    } else if (this.domainDisplayItem === DomainDisplayItem.All) {
      return true;
    } else {
      return this.getCurrentAnimationFrame().domainRowToHighlight === row;
    }
  }

  isRowUnderConsideration(row: number): boolean {
    return (
      (!this.isInQuizMode() || !this.canClickOnTileIfInQuizMode) &&
      this.getCurrentAnimationFrame().rowInConsideration === row
    );
  }

  isUsingForwardChecking(): boolean {
    return this.checkingItem === CheckingItem.ForwardChecking;
  }

  isHighlightingDomains(): boolean {
    return (
      this.isUsingForwardChecking() &&
      this.domainDisplayItem !== DomainDisplayItem.None
    );
  }

  markAnimationFramesForUpdate(): void {
    this.needToUpdateAnimationFrames = true;
    this.setAnimationIndex(0);
    this.setAnimationRunning(false);
    this.updateAnimationFramesIfNeeded();
  }

  async handleTileClick(pos: Pos): Promise<void> {
    if (!this.isInQuizMode() || !this.canClickOnTileIfInQuizMode) {
      return;
    } else if (this.isCorrectGuessForWhereQueenWillBePlaced(pos)) {
      await this.displayGuessCommentaryTemporarily(CommentaryType.CorrectGuess);
      await this.handleMovingToNextFrameToGuess();
    } else {
      this.displayGuessCommentaryTemporarily(CommentaryType.IncorrectGuess);
    }
  }

  async handleMovingToNextFrameToGuess(): Promise<void> {
    this.animationIndex = this.findNextAnimFrameIndexWhereQueenPlaced();

    const nextFrameIndex = this.findNextAnimFrameIndexWhereQueenPlaced();

    if (nextFrameIndex === -1) {
      this.commentaryType = CommentaryType.GuessedAllCorrect;
      this.animationIndex = this.animationFrames.length - 1;
    } else {
      await this.prepareToMoveToNextFrameToGuess(nextFrameIndex);
    }
  }

  async prepareToMoveToNextFrameToGuess(nextFrameIndex: number): Promise<void> {
    this.canClickOnTileIfInQuizMode = false;
    this.commentaryType = CommentaryType.AlgoStep;

    await this.animateMovingToNextFrameToGuess(
      nextFrameIndex,
      this.animationFrames
    );

    this.canClickOnTileIfInQuizMode = true;
    this.commentaryType = CommentaryType.GuessExplanation;
  }

  async animateMovingToNextFrameToGuess(
    nextFrameIndex: number,
    animationFramesRef: BoardAnimationFrame[]
  ): Promise<void> {
    while (
      this.animationIndex < nextFrameIndex - 1 &&
      animationFramesRef === this.animationFrames
    ) {
      this.animationIndex++;
      await wait(this.quizDelayMs);
    }
  }

  updateQuizDelayMs(quizDelayMs: Event): void {
    this.quizDelayMs = getValueFromRangeEvent(quizDelayMs);
  }

  isCorrectGuessForWhereQueenWillBePlaced({ row, col }: Pos): boolean {
    const nextFrameIndex = this.findNextAnimFrameIndexWhereQueenPlaced();
    const nextFrame = this.animationFrames[nextFrameIndex];
    const colPlacedAtNextFrame = findQueenColAtRow(
      nextFrame.board,
      assertNonNull(nextFrame.rowInConsideration)
    );

    return row === nextFrame.rowInConsideration && col === colPlacedAtNextFrame;
  }

  findNextAnimFrameIndexWhereQueenPlaced(): number {
    return this.animationFrames.findIndex(
      ({ commentary }, index) =>
        index > this.animationIndex &&
        commentary === 'Assigning Queen to column...'
    );
  }

  displayGuessCommentaryTemporarily(
    commentaryType: CommentaryType
  ): Promise<void> {
    return new Promise((resolve) => {
      this.commentaryType = commentaryType;
      this.canClickOnTileIfInQuizMode = false;

      setTimeout(() => {
        this.commentaryType = CommentaryType.GuessExplanation;
        this.canClickOnTileIfInQuizMode = true;
        resolve();
      }, this.quizDelayMs);
    });
  }

  getCommentary(): string {
    switch (this.commentaryType) {
      case CommentaryType.AlgoStep:
        return this.getCurrentAnimationFrame().commentary;
      case CommentaryType.CorrectGuess:
        return 'Guess is correct! Animating algorithm till step before the next queen is placed';
      case CommentaryType.GuessedAllCorrect:
        return 'All guesses correct! Try another configuration';
      case CommentaryType.GuessExplanation:
        return 'Click on the tile you think a queen will be placed next. Remember, the algorithm might not place it in a valid position depending on the configuration.';
      default:
        return 'Incorrect! Try again';
    }
  }
}

const enum CommentaryType {
  IncorrectGuess,
  CorrectGuess,
  GuessedAllCorrect,
  GuessExplanation,
  AlgoStep,
}

enum Modal {
  Tutorial,
  None,
}
