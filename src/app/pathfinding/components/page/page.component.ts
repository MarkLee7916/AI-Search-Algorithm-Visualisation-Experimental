import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import {
  ConcreteAlgoImpl,
  unidirectionalAstar,
  unidirectionalBFS,
  unidirectionalDFS,
  unidirectionalDijkstras,
  unidirectionalGBFS,
  unidirectionalRandom,
} from 'src/app/pathfinding/algos/conretePathfindingAlgos';
import {
  genFilledGridMaze,
  genHorizontalDivisionMaze,
  genRandomMaze,
  genVerticalDivisionMaze,
  Maze,
} from 'src/app/pathfinding/algos/mazeGenAlgos';
import {
  AlgoItem,
  TilePlaceItem,
  MazeGenItem,
  NeighboursItem,
  TileDisplayItem,
  UserInteractionModeItem,
  QuizzableAlgoItem,
} from 'src/app/pathfinding/models/dropdownItemEnums';
import {
  DEFAULT_GOAL_POS,
  DEFAULT_START_POS,
  DEFAULT_WEIGHT,
  genAllDirectionNeighbours,
  genDiagonalNeighbours,
  GenNeighboursImpl,
  genNonDiagonalNeighbours,
  genRandomWeight,
  genUniquePosId,
  genUniqueRowId,
  GridAnimationFrame,
  GridBarriers,
  GridWeights,
  HEIGHT,
  initBlankGridAnimationFrame,
  initBlankGridBarriers,
  initBlankGridWeights,
  initGridPositions,
  isSamePos,
  Pos,
  TileAnimationFrame,
  WIDTH,
} from 'src/app/pathfinding/models/grid';
import { TileDragAndDropService } from 'src/app/pathfinding/services/tile-drag-and-drop.service';
import { computeManhattanDist } from 'src/app/pathfinding/algos/cmps';
import { UncheckedObjMap } from 'src/app/shared/models/uncheckedObjMap';
import {
  initGenericArray,
  removeDuplicates,
  removeItemFromArray,
  safeGetArrayIndex,
} from 'src/app/shared/genericUtils';
import { TutorialModalSlide } from '../tutorial-modal/tutorial-modal.component';
import cloneDeep from 'clone-deep';
import {
  genAstarQuizCase,
  genDijsktraQuizCase,
  genGBFSQuizCase,
  QuizCase,
} from '../../models/quizCases';
import { TheoryModalSlide } from '../theory-modal/theory-modal.component';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnInit {
  /* New features to add:

   Feature 1: a tile placement selection to delete obstacles
              when triggered on some tile, this should delete any weights or barriers on that tile
              and its neighbours both diagonal and non-diagonal
  */

  // A grid where each tile is a Pos object corresponding to its position
  readonly gridPositions = initGridPositions();

  // An enum for each kind of modal that can be displayed on the screen
  readonly Modal = Modal;

  // Functions to uniquely identify rows and columns to optimise *ngFor calls
  readonly trackByPos = genUniquePosId;
  readonly trackByRow = genUniqueRowId;

  // Lists of enum values that correspond to the dropdown items in the menu
  readonly tilePlaceItems = Object.values(TilePlaceItem);
  readonly algoItems = Object.values(AlgoItem);
  readonly quizzableAlgoItems = Object.values(QuizzableAlgoItem);
  readonly mazeGenItems = Object.values(MazeGenItem);
  readonly neighboursItems = Object.values(NeighboursItem);
  readonly tileDisplayItems = Object.values(TileDisplayItem);
  readonly userInteractionModeItems = Object.values(UserInteractionModeItem);

  // An enum of tutorial and theory modal slides
  readonly tutorialModalSlides = Object.values(TutorialModalSlide);
  readonly theoryModalSlides = Object.values(TheoryModalSlide);

  readonly tilePlaceItemToImpl = new UncheckedObjMap<
    TilePlaceItem,
    (pos: Pos) => void
  >([
    [TilePlaceItem.Barrier, this.toggleBarrier],
    [TilePlaceItem.RandomWeight, this.toggleRandomWeight],
    [TilePlaceItem.CustomWeight, this.updatePosToPlaceCustomWeightAt],
  ]);

  readonly mazeGenItemToImpl = new UncheckedObjMap<MazeGenItem, () => Maze>([
    [MazeGenItem.Random, genRandomMaze],
    [MazeGenItem.FillGrid, genFilledGridMaze],
    [MazeGenItem.HorizontalDivision, genHorizontalDivisionMaze],
    [MazeGenItem.VerticalDivision, genVerticalDivisionMaze],
  ]);

  readonly algoItemToImpl = new UncheckedObjMap<AlgoItem, ConcreteAlgoImpl>([
    [AlgoItem.BFS, unidirectionalBFS],
    [AlgoItem.DFS, unidirectionalDFS],
    [AlgoItem.Dijkstras, unidirectionalDijkstras],
    [AlgoItem.Astar, unidirectionalAstar],
    [AlgoItem.GBFS, unidirectionalGBFS],
    [AlgoItem.Random, unidirectionalRandom],
  ]);

  readonly algoItemToQuizCase = new UncheckedObjMap<AlgoItem, QuizCase>([
    [AlgoItem.Dijkstras, genDijsktraQuizCase()],
    [AlgoItem.GBFS, genGBFSQuizCase()],
    [AlgoItem.Astar, genAstarQuizCase()],
  ]);

  readonly neighboursItemToImpl = new UncheckedObjMap<
    NeighboursItem,
    GenNeighboursImpl
  >([
    [NeighboursItem.AllDirections, genAllDirectionNeighbours],
    [NeighboursItem.Diagonals, genDiagonalNeighbours],
    [NeighboursItem.NonDiagonals, genNonDiagonalNeighbours],
  ]);

  // A HEIGHT * WIDTH matrix where each cell corresponds to a grid weight in the UI
  gridWeights = initBlankGridWeights();

  // A HEIGHT * WIDTH matrix where each cell corresponds to a grid barrier in the UI
  gridBarriers = initBlankGridBarriers();

  // The frames of the animation
  animationFrames = [initBlankGridAnimationFrame()];

  // An index into animationFrames controlling which frame is rendered on the screen
  animationIndex = 0;

  needToUpdateAnimationFrames = true;

  // Source tile the algorithm will search from
  startPos = DEFAULT_START_POS;

  // Target tile the algorithm will aim to find a path to
  goalPos = DEFAULT_GOAL_POS;

  // The position in the grid a user is currently adding a custom weight at
  posToPlaceCustomWeightAt: Pos | null = null;

  // Keeps track of whether user has their mouse held down
  isMouseDown = false;

  // Items corresponding to the dropdown menus
  tilePlaceItem = TilePlaceItem.Barrier;
  userInteractionModeItem = UserInteractionModeItem.Visualise;
  mazeGenItem = MazeGenItem.Random;
  algoItem = AlgoItem.BFS;
  neighboursItem = NeighboursItem.NonDiagonals;
  tileDisplayItem = TileDisplayItem.Weights;

  // The current modal being displayed
  modalDisplayed = Modal.Tutorial;

  // The type of commentary being displayed depending on what the user is currently doing
  commentaryType = CommentaryType.AlgoStep;

  isAnimationRunning = false;

  constructor(public dragAndDropService: TileDragAndDropService) {}

  ngOnInit(): void {
    this.initialiseSaveNameListIfNotInLocalStorage();
    this.loadSavedGridState(
      '**Auto-Generated** Grid before app was last closed'
    );
    this.updateAnimationFramesIfNeeded();
  }

  updatePosToPlaceCustomWeightAt(pos: Pos | null): void {
    this.posToPlaceCustomWeightAt = pos;
  }

  initialiseSaveNameListIfNotInLocalStorage(): void {
    if (!this.parseLocalStorageItem('saveNames')) {
      this.addItemToLocalStorage('saveNames', []);
    }
  }

  // Update animation frames if the problem definitions has changed
  updateAnimationFramesIfNeeded(): void {
    if (this.needToUpdateAnimationFrames) {
      this.animationFrames = this.algoItemToImpl.get(this.algoItem)(
        this.startPos,
        this.goalPos,
        this.gridWeights,
        this.gridBarriers,
        this.neighboursItemToImpl.get(this.neighboursItem)
      );

      this.needToUpdateAnimationFrames = false;
    }
  }

  // If animation index if out of bounds, put it within bounds
  safeGetAnimationIndex(): number {
    return safeGetArrayIndex(this.animationFrames, this.animationIndex);
  }

  getCurrentAnimationFrame(): GridAnimationFrame {
    return this.animationFrames[this.safeGetAnimationIndex()];
  }

  handleTileDrag(pos: Pos, event: Event): void {
    this.dragAndDropService.handleDrag(event, pos, this.startPos, this.goalPos);
  }

  // If a tile drop is valid, update the appropiate state
  handleTileDrop(pos: Pos): void {
    const draggedFromPos = this.dragAndDropService.getDraggedFromPos();

    if (this.canDropAtPos(pos) && draggedFromPos !== null) {
      this.updatePositionsFromDrop(draggedFromPos, pos);
    }

    this.toggleMouseDown();
  }

  // Route a tile click depending on whether we're in quiz mode
  handleTileClick(pos: Pos): void {
    if (this.isInQuizMode()) {
      this.handleUserGuess(pos);
    } else {
      this.placeAtTile(pos);
    }
  }

  // Route a user guess depending on whether it was correct or not
  handleUserGuess(pos: Pos): void {
    if (isSamePos(pos, this.getTileBeingExpanded())) {
      this.handleCorrectGuess();
    } else {
      this.commentaryType = CommentaryType.IncorrectGuess;
    }
  }

  // If user guess was correct, handle moving to the next frame and displaying the appropiate commentary
  handleCorrectGuess(): void {
    if (this.hasPathBeenFoundForNextAnimationFrame()) {
      this.setAnimationIndex(this.animationFrames.length - 1);
      this.commentaryType = CommentaryType.GuessedAllCorrect;
    } else {
      this.setAnimationIndex(this.animationIndex + 2);
      this.commentaryType = CommentaryType.CorrectGuess;
    }
  }

  // Return true if the next expanding animation frame involves the final path being found
  hasPathBeenFoundForNextAnimationFrame(): boolean {
    return this.animationFrames[this.animationIndex + 2].grid.some((row) =>
      row.some((tile) => tile === TileAnimationFrame.FinalPath)
    );
  }

  // Iterate through grid and return the position of the current tile being expanded
  getTileBeingExpanded(): Pos {
    const nextFrame = this.animationFrames[this.animationIndex + 1];

    for (let row = 0; row < HEIGHT; row++) {
      for (let col = 0; col < WIDTH; col++) {
        if (nextFrame.grid[row][col] === TileAnimationFrame.BeingExpanded) {
          return { row, col };
        }
      }
    }

    throw new Error('No tile being expanded found');
  }

  // Handle placing an item on a tile in the grid
  placeAtTile(pos: Pos): void {
    if (
      !this.isStartPos(pos) &&
      !this.isGoalPos(pos) &&
      !this.isAnimationRunning
    ) {
      const placeImpl = this.tilePlaceItemToImpl.get(this.tilePlaceItem);

      placeImpl.bind(this)(pos);
    }
  }

  // Generate a maze using whatever algorithm and placement item the user has selected
  generateMaze(): void {
    const maze = this.mazeGenItemToImpl.get(this.mazeGenItem)();

    this.clearBarriersAndWeights();

    this.gridPositions.forEach((rowPositions) =>
      rowPositions.forEach(({ row, col }) => {
        if (maze[row][col]) {
          this.handleTileClick({ row, col });
        }
      })
    );
  }

  clearBarriersAndWeights(): void {
    this.setGridBarriers(initBlankGridBarriers());
    this.setGridWeights(initBlankGridWeights());
  }

  // If there's a barrier at the tile, remove it, else add a barrier
  toggleBarrier({ row, col }: Pos): void {
    const gridBarriersCopy = cloneDeep(this.gridBarriers);

    gridBarriersCopy[row][col] = !gridBarriersCopy[row][col];

    this.setGridBarriers(gridBarriersCopy);
  }

  // If there's a default weight at the tile, generate a random one, else reset it back to the default weight
  toggleRandomWeight({ row, col }: Pos): void {
    if (this.gridWeights[row][col] === DEFAULT_WEIGHT) {
      this.placeWeightAt({ row, col }, genRandomWeight());
    } else {
      this.placeWeightAt({ row, col }, DEFAULT_WEIGHT);
    }
  }

  placeWeightAt({ row, col }: Pos, value: number): void {
    const gridWeightsCopy = cloneDeep(this.gridWeights);

    gridWeightsCopy[row][col] = value;
    this.setTileDisplayItem(TileDisplayItem.Weights);
    this.setGridWeights(gridWeightsCopy);
  }

  placeCustomWeightAt(pos: Pos, customWeight: number): void {
    this.placeWeightAt(pos, customWeight);
    this.posToPlaceCustomWeightAt = null;
  }

  isStartPos(pos: Pos): boolean {
    return isSamePos(this.startPos, pos);
  }

  isGoalPos(pos: Pos): boolean {
    return isSamePos(this.goalPos, pos);
  }

  isPosToPlaceCustomWeightAt(pos: Pos): boolean {
    if (this.posToPlaceCustomWeightAt === null) {
      return false;
    } else {
      return isSamePos(this.posToPlaceCustomWeightAt, pos);
    }
  }

  // When user drops a tile onto another, update the positions
  updatePositionsFromDrop(draggedFromPos: Pos, droppedAtPos: Pos): void {
    if (isSamePos(draggedFromPos, this.startPos)) {
      this.setStartPos(droppedAtPos);
    } else {
      this.setGoalPos(droppedAtPos);
    }
  }

  // Return true if this position is considered ok to drop a tile onto
  canDropAtPos(pos: Pos): boolean {
    return this.dragAndDropService.canDrop(
      pos,
      this.gridBarriers,
      this.startPos,
      this.goalPos
    );
  }

  setTilePlaceItem(tilePlaceItem: string): void {
    this.tilePlaceItem = tilePlaceItem as TilePlaceItem;
  }

  setAlgoItem(algoItem: string): void {
    this.algoItem = algoItem as AlgoItem;
    this.markAnimationFramesForUpdate();

    if (this.isInQuizMode()) {
      this.setUpQuizModeForCurrentAlgoItem();
    }
  }

  setTileDisplayItem(tileDisplayItem: string): void {
    this.tileDisplayItem = tileDisplayItem as TileDisplayItem;
  }

  setMazeGenItem(mazeGenItem: string): void {
    this.mazeGenItem = mazeGenItem as MazeGenItem;
  }

  setNeighboursItem(neighboursItem: string): void {
    this.neighboursItem = neighboursItem as NeighboursItem;
    this.markAnimationFramesForUpdate();
  }

  setGridBarriers(gridBarriers: GridBarriers): void {
    this.gridBarriers = gridBarriers;
    this.markAnimationFramesForUpdate();
  }

  setGridWeights(gridWeights: GridWeights): void {
    this.gridWeights = gridWeights;
    this.markAnimationFramesForUpdate();
  }

  setStartPos(pos: Pos): void {
    this.startPos = pos;
    this.markAnimationFramesForUpdate();
  }

  setGoalPos(pos: Pos): void {
    this.goalPos = pos;
    this.markAnimationFramesForUpdate();
  }

  // Mark the animation frames to be updated whenever updateAnimationFramesIsNeeded() is called
  markAnimationFramesForUpdate(): void {
    this.needToUpdateAnimationFrames = true;
    this.setAnimationIndex(0);
    this.setAnimationRunning(false);
  }

  setAnimationRunning(running: boolean): void {
    this.isAnimationRunning = running;
  }

  setAnimationIndex(index: number): void {
    this.animationIndex = index;
  }

  getHeuristicDist(pos: Pos): number {
    return computeManhattanDist(pos, this.goalPos);
  }

  hideModal(): void {
    this.modalDisplayed = Modal.None;
  }

  setModalDisplayed(modal: Modal): void {
    this.modalDisplayed = modal;
  }

  setUserInteractionModeItem(item: string): void {
    this.userInteractionModeItem = item as UserInteractionModeItem;

    if (this.isInQuizMode()) {
      this.setUpQuizModeForCurrentAlgoItem();
    } else {
      this.commentaryType = CommentaryType.AlgoStep;
    }
  }

  // Change problem config to set up the quiz mode
  setUpQuizModeForCurrentAlgoItem(): void {
    if (!this.isAlgoItemQuizzable()) {
      this.algoItem = AlgoItem.Dijkstras;
    }

    this.commentaryType = CommentaryType.GuessExplanation;
    this.setUpQuizCase();
    this.updateAnimationFramesIfNeeded();
  }

  // Return true if quiz mode supports the current algorithm
  isAlgoItemQuizzable(): boolean {
    return this.quizzableAlgoItems
      .map((item) => item.toString())
      .includes(this.algoItem.toString());
  }

  // Change state of problem config to render a prewritten case to test the user
  setUpQuizCase(): void {
    const quizCase = this.algoItemToQuizCase.get(this.algoItem);

    this.setGridBarriers(quizCase.gridBarriers);
    this.setGridWeights(quizCase.gridWeights);
    this.updatePositionsFromDrop(this.startPos, quizCase.startPos);
    this.updatePositionsFromDrop(this.goalPos, quizCase.goalPos);
    this.setNeighboursItem(NeighboursItem.NonDiagonals);
    this.setTileDisplayItem(TileDisplayItem.Weights);
  }

  isInQuizMode(): boolean {
    return this.userInteractionModeItem === UserInteractionModeItem.Quiz;
  }

  isPlacingCustomWeights(): boolean {
    return this.tilePlaceItem === TilePlaceItem.CustomWeight;
  }

  // Get the commentary that will accompany the current animation frame
  getCommentary(): string {
    switch (this.commentaryType) {
      case CommentaryType.AlgoStep:
        return this.getCurrentAnimationFrame().commentary;
      case CommentaryType.CorrectGuess:
        return 'Correct!';
      case CommentaryType.GuessedAllCorrect:
        return 'All guesses correct! Try another algorithm';
      case CommentaryType.GuessExplanation:
        return 'Click on the tile you think will be expanded next';
      default:
        return 'Incorrect! Try again';
    }
  }

  addItemToLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  saveCurrentGridState(saveName: string): void {
    this.addItemToLocalStorage(saveName + 'startPos', this.startPos);
    this.addItemToLocalStorage(saveName + 'goalPos', this.goalPos);
    this.addItemToLocalStorage(saveName + 'gridWeights', this.gridWeights);
    this.addItemToLocalStorage(saveName + 'gridBarriers', this.gridBarriers);
    this.addSaveNameToListOfSaveNames(saveName);
  }

  addSaveNameToListOfSaveNames(saveName: string): void {
    const saveNames = this.parseLocalStorageItem('saveNames');

    saveNames.unshift(saveName);
    this.addItemToLocalStorage('saveNames', removeDuplicates(saveNames));
  }

  deleteSavedGridState(saveName: string): void {
    const saveNames = this.parseLocalStorageItem('saveNames');

    removeItemFromArray(saveNames, saveName);
    this.addItemToLocalStorage('saveNames', saveNames);
  }

  loadSavedGridState(saveName: string): void {
    const startPos = this.parseLocalStorageItem(saveName + 'startPos');
    const goalPos = this.parseLocalStorageItem(saveName + 'goalPos');
    const gridBarriers = this.parseLocalStorageItem(saveName + 'gridBarriers');
    const gridWeights = this.parseLocalStorageItem(saveName + 'gridWeights');

    if (startPos && goalPos && gridBarriers && gridWeights) {
      this.setStartPos(this.movePositionWithinBoundsOfGrid(startPos));
      this.setGoalPos(this.movePositionWithinBoundsOfGrid(goalPos));
      this.setGridBarriers(this.adaptDimensionsToCurrGrid(gridBarriers, false));
      this.setGridWeights(this.adaptDimensionsToCurrGrid(gridWeights, 1));
    }
  }

  parseLocalStorageItem(key: string): any {
    const item = localStorage.getItem(key);

    if (item === null) {
      return null;
    } else {
      return JSON.parse(item);
    }
  }

  adaptDimensionsToCurrGrid<T>(grid: T[][], emptyValue: T): T[][] {
    grid = this.padOutGridColumns(grid, emptyValue);
    grid = this.padOutGridRows(grid, emptyValue);
    grid = grid.slice(0, HEIGHT);
    grid = grid.map((row) => row.slice(0, WIDTH));

    return grid;
  }

  padOutGridColumns<T>(grid: T[][], emptyValue: T): T[][] {
    while (grid[0].length < WIDTH) {
      grid = this.appendEmptyColumnToGrid(grid, emptyValue);
    }

    return grid;
  }

  padOutGridRows<T>(grid: T[][], emptyValue: T): T[][] {
    while (grid.length < HEIGHT) {
      grid = this.appendEmptyRowToGrid(grid, emptyValue);
    }

    return grid;
  }

  appendEmptyColumnToGrid<T>(grid: T[][], emptyValue: T): T[][] {
    return grid.map((row) => row.concat(emptyValue));
  }

  appendEmptyRowToGrid<T>(grid: T[][], emptyValue: T): T[][] {
    const gridCopy = cloneDeep(grid);
    const emptyRow = initGenericArray(grid[0].length, () => emptyValue);

    gridCopy.push(emptyRow);

    return gridCopy;
  }

  movePositionWithinBoundsOfGrid(pos: Pos): Pos {
    return {
      row: pos.row >= HEIGHT ? HEIGHT - 1 : pos.row,
      col: pos.col >= WIDTH ? WIDTH - 1 : pos.col,
    };
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('mouseup', ['$event'])
  toggleMouseDownFromEvent(event: MouseEvent): void {
    this.isMouseDown = event.buttons === 1;
  }

  @HostListener('window:beforeunload', ['$event'])
  saveLastGridStateBeforeAppCloses(): void {
    this.saveCurrentGridState(
      '**Auto-Generated** Grid before app was last closed'
    );
  }

  toggleMouseDown(): void {
    this.isMouseDown = !this.isMouseDown;
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
  Theory,
  SaveGrid,
  LoadGrid,
  None,
}
