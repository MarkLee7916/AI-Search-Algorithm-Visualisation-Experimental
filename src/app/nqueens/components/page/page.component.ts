import { Component, HostListener, OnInit } from '@angular/core';
import {
  addItemToLocalStorage,
  assertNonNull,
  AVERAGE_OF_VW_AND_VH,
  getValueFromRangeEvent,
  parseLocalStorageItem,
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

  // The minumum size the user is allowed to set a board to in terms of tile count
  readonly MIN_BOARD_SIZE = MIN_BOARD_SIZE;

  // The maximum size the user is allowed to set a board to in terms of tile count
  readonly MAX_BOARD_SIZE = MAX_BOARD_SIZE;

  // The size of a board in pixels on the screen, note this is invariant and doesn't change when a user changes the board size
  readonly BOARD_SIZE_IN_PX = AVERAGE_OF_VW_AND_VH * 0.5;

  // An enumeration of the slides in the tutorial menu
  readonly tutorialModalSlides = Object.values(TutorialModalSlide);

  // Enumerations corresponding to the dropdown menu options
  readonly pruningAlgoItems = Object.values(PruningAlgoItem);
  readonly varHeuristicItems = Object.values(VarHeuristicItem);
  readonly valHeuristicItems = Object.values(ValHeuristicItem);
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

  // The size of the board in terms of tile count
  boardSize = 4;

  // The animation for the current problem config
  animationFrames = [initBlankBoardAnimationFrame(this.boardSize)];

  isAnimationRunning = false;

  // An index into the animationFrames array, controlling which animation frame is displayed on the screen
  animationIndex = 0;

  // True if the problem config has changed such that the animation frames will need recomputed
  needToUpdateAnimationFrames = true;

  modalDisplayed = Modal.Tutorial;

  // The dropdown items that are currently selected by the user in the menu
  pruningAlgoItem = PruningAlgoItem.Node;
  varHeuristicItem = VarHeuristicItem.InOrder;
  valHeuristicItem = ValHeuristicItem.InOrder;
  checkingItem = CheckingItem.Assigning;
  userInteractionModeItem = UserInteractionModeItem.Visualise;

  // The type of commentary that the user will see accompanying an animation frame
  commentaryType = CommentaryType.AlgoStep;

  // True if not currently animating the next animation frames before a user makes another guess for quiz mode
  canClickOnTileIfInQuizMode = true;

  // The delay when animating the next animation frames before a user makes another guess for quiz mode
  quizDelayMs = 2000;

  ngOnInit(): void {
    this.loadDropdownOptions();
    this.updateAnimationFramesIfNeeded();
  }

  loadDropdownOptions(): void {
    if (parseLocalStorageItem('boardSize') !== null) {
      this.boardSize = parseLocalStorageItem('boardSize');
      this.pruningAlgoItem = parseLocalStorageItem('pruningAlgoItem');
      this.varHeuristicItem = parseLocalStorageItem('varHeuristicItem');
      this.valHeuristicItem = parseLocalStorageItem('valHeuristicItem');
      this.checkingItem = parseLocalStorageItem('checkingItem');
      this.animationIndex = parseLocalStorageItem('animationIndex');
      this.commentaryType = parseLocalStorageItem('commentaryType');
      this.userInteractionModeItem = parseLocalStorageItem(
        'userInteractionModeItem'
      );
    }
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

  // Recompute the animation for the current problem config
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

  // Get the CSS class of a row in order to highlight it if it's under consideration
  getRowClass(row: number): string {
    let classStr = 'row';

    if (this.isRowUnderConsideration(row)) {
      classStr += ' opacity-highlight';
      classStr += ' black-border';
    }

    return classStr;
  }

  // True if tile should be highlighted as a member of its rows domain when "Display Domains of All Rows" is selected
  isTileDomainHighlighted(row: number, col: number): boolean {
    return this.getCurrentAnimationFrame().varToDomain.get(row).includes(col);
  }

  // True if the algorithm is currently placing a queen at this row
  isRowUnderConsideration(row: number): boolean {
    return (
      (!this.isInQuizMode() || !this.canClickOnTileIfInQuizMode) &&
      this.getCurrentAnimationFrame().rowInConsideration === row
    );
  }

  isUsingForwardChecking(): boolean {
    return this.checkingItem === CheckingItem.ForwardChecking;
  }

  // Mark animation frames for update and update them
  // Note this doesn't use lazy computation, but can easily be refractored to if performance becomes an issue
  markAnimationFramesForUpdate(): void {
    this.needToUpdateAnimationFrames = true;
    this.setAnimationIndex(0);
    this.setAnimationRunning(false);
    this.updateAnimationFramesIfNeeded();
  }

  // If in quiz mode, route to the appropiate method depending on whether guess was correct or incorrect
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

  // Get the next frame where a queen is placed and animate moving to it
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

  // Set up commentary and user interaction permissions for the animation of moving to the next frame where a queen is placed
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

  // Animate moving to the next frame where a queen is placed
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

  // True if a user has made the correct guess for where the next queen will be placed
  isCorrectGuessForWhereQueenWillBePlaced({ row, col }: Pos): boolean {
    const nextFrameIndex = this.findNextAnimFrameIndexWhereQueenPlaced();
    const nextFrame = this.animationFrames[nextFrameIndex];
    const colPlacedAtNextFrame = findQueenColAtRow(
      nextFrame.board,
      assertNonNull(nextFrame.rowInConsideration)
    );

    return row === nextFrame.rowInConsideration && col === colPlacedAtNextFrame;
  }

  // Get the next frame where a queen will be placed
  findNextAnimFrameIndexWhereQueenPlaced(): number {
    return this.animationFrames.findIndex(
      ({ commentary }, index) =>
        index > this.animationIndex &&
        commentary === 'Assigning Queen to column...'
    );
  }

  // Display some commentary for a limited time
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

  // Get the commentary string that will accompany each animation frame
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

  saveDropdownOptions(): void {
    addItemToLocalStorage('pruningAlgoItem', this.pruningAlgoItem);
    addItemToLocalStorage('varHeuristicItem', this.varHeuristicItem);
    addItemToLocalStorage('valHeuristicItem', this.valHeuristicItem);
    addItemToLocalStorage('checkingItem', this.checkingItem);
    addItemToLocalStorage('animationIndex', this.animationIndex);
    addItemToLocalStorage('boardSize', this.boardSize);
    addItemToLocalStorage('commentaryType', this.commentaryType);
    addItemToLocalStorage(
      'userInteractionModeItem',
      this.userInteractionModeItem
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  saveAppStateBeforeClose(): void {
    this.saveDropdownOptions();
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
