import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  DEFAULT_TILE_PLACE_ITEM,
  DEFAULT_USER_INTERACTION_MODE_ITEM,
  DEFAULT_MAZE_GEN_ITEM,
  DEFAULT_ALGO_ITEM,
  DEFAULT_NEIGHBOURS_ITEM,
  DEFAULT_TILE_DISPLAY_ITEM,
} from 'src/app/pathfinding/models/dropdownItemEnums';
import {
  adaptDimensionsToCurrGrid,
  DEFAULT_GOAL_POS,
  DEFAULT_NEIGHBOUR_VISIT_ORDER,
  DEFAULT_START_POS,
  DEFAULT_WEIGHT,
  FilterNeighboursImpl,
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
  keepAllNeighbours,
  keepDiagonalNeigbours,
  keepNonDiagonalNeigbours,
  movePositionWithinBoundsOfGrid,
  Neighbour,
  Pos,
  TileAnimationFrame,
  WIDTH,
} from 'src/app/pathfinding/models/grid';
import { TileDragAndDropService } from 'src/app/pathfinding/services/tile-drag-and-drop.service';
import { computeManhattanDist } from 'src/app/pathfinding/algos/cmps';
import { UncheckedObjMap } from 'src/app/shared/models/uncheckedObjMap';
import {
  addItemToLocalStorage,
  isHeightGreaterThan,
  isWidthGreaterThan,
  IS_TOUCHSCREEN_DEVICE,
  parseLocalStorageItem,
  randomIntBetween,
  removeStrDuplicates,
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
import { MousePressService } from '../../services/mouse-press.service';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import {
  AUTO_GENERATED_SAVE_STR,
  PATHFINDING_OPTIONS_STR,
  SAVE_NAMES_STR,
  START_POS_STR,
  GOAL_POS_STR,
  GRID_WEIGHTS_STR,
  GRID_BARRIERS_STR,
} from '../../models/local-storage-constants';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnInit {
  // A grid where each tile is a Pos object corresponding to its position
  readonly gridPositions = initGridPositions();

  // An enum for each kind of modal that can be displayed on the screen
  readonly Modal = Modal;

  // Functions to uniquely identify rows and columns to optimise *ngFor calls
  readonly trackByPos = genUniquePosId;
  readonly trackByRow = genUniqueRowId;

  // Helper functions for the HTML template to use
  readonly parseLocalStorageItem = parseLocalStorageItem;
  readonly isWidthGreaterThan = isWidthGreaterThan;
  readonly isHeightGreaterThan = isHeightGreaterThan;

  // Lists of enum values that correspond to the dropdown items in the menu
  readonly algoItems = Object.values(AlgoItem);
  readonly quizzableAlgoItems = Object.values(QuizzableAlgoItem);
  readonly mazeGenItems = Object.values(MazeGenItem);
  readonly neighboursItems = Object.values(NeighboursItem);
  readonly tileDisplayItems = Object.values(TileDisplayItem);
  readonly userInteractionModeItems = Object.values(UserInteractionModeItem);
  readonly tilePlaceItems = Object.values(TilePlaceItem).filter(
    (item) => !IS_TOUCHSCREEN_DEVICE || item !== TilePlaceItem.CustomWeight
  );

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
    FilterNeighboursImpl
  >([
    [NeighboursItem.AllDirections, keepAllNeighbours],
    [NeighboursItem.Diagonals, keepDiagonalNeigbours],
    [NeighboursItem.NonDiagonals, keepNonDiagonalNeigbours],
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

  neighbourVisitOrder = DEFAULT_NEIGHBOUR_VISIT_ORDER;

  // Items corresponding to the dropdown menus
  tilePlaceItem = DEFAULT_TILE_PLACE_ITEM;
  userInteractionModeItem = DEFAULT_USER_INTERACTION_MODE_ITEM;
  mazeGenItem = DEFAULT_MAZE_GEN_ITEM;
  algoItem = DEFAULT_ALGO_ITEM;
  neighboursItem = DEFAULT_NEIGHBOURS_ITEM;
  tileDisplayItem = DEFAULT_TILE_DISPLAY_ITEM;

  // The current modal being displayed
  modalDisplayed = Modal.Tutorial;

  // The type of commentary being displayed depending on what the user is currently doing
  commentaryType = CommentaryType.AlgoStep;

  isAnimationRunning = false;

  constructor(
    public dragAndDropService: TileDragAndDropService,
    public mousePressService: MousePressService,
    public changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initialiseSaveNameListIfNotInLocalStorage();
    this.loadSavedGridState(AUTO_GENERATED_SAVE_STR);
    this.loadUserOptions();
    this.updateAnimationFramesIfNeeded();
    this.reloadPageOnResize();
  }

  reloadPageOnResize(): void {
    fromEvent(window, 'resize')
      .pipe(debounceTime(1000))
      .subscribe(() => location.reload());
  }

  loadUserOptions(): void {
    const pathfindingOptions = parseLocalStorageItem(PATHFINDING_OPTIONS_STR);

    if (pathfindingOptions) {
      this.algoItem = pathfindingOptions.algoItem ?? DEFAULT_ALGO_ITEM;
      this.mazeGenItem =
        pathfindingOptions.mazeGenItem ?? DEFAULT_MAZE_GEN_ITEM;
      this.tileDisplayItem =
        pathfindingOptions.tileDisplayItem ?? DEFAULT_TILE_DISPLAY_ITEM;
      this.neighboursItem =
        pathfindingOptions.neighboursItem ?? DEFAULT_NEIGHBOURS_ITEM;
      this.tilePlaceItem =
        pathfindingOptions.tilePlaceItem ?? DEFAULT_TILE_PLACE_ITEM;
      this.neighbourVisitOrder =
        pathfindingOptions.neighbourVisitOrder ?? DEFAULT_NEIGHBOUR_VISIT_ORDER;
    }
  }

  updatePosToPlaceCustomWeightAt(pos: Pos | null): void {
    this.posToPlaceCustomWeightAt = pos;
  }

  initialiseSaveNameListIfNotInLocalStorage(): void {
    if (!parseLocalStorageItem(SAVE_NAMES_STR)) {
      addItemToLocalStorage(SAVE_NAMES_STR, []);
    }
  }

  // Update animation frames if the problem definition has changed
  updateAnimationFramesIfNeeded(): void {
    const neighboursToAdd = this.neighboursItemToImpl.get(this.neighboursItem)(
      this.neighbourVisitOrder
    );

    if (this.needToUpdateAnimationFrames) {
      this.animationFrames = this.algoItemToImpl.get(this.algoItem)(
        this.startPos,
        this.goalPos,
        this.gridWeights,
        this.gridBarriers,
        neighboursToAdd
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

    this.mousePressService.toggleMouseDown();
  }

  // Route a tile click depending on whether we're in quiz mode
  // Manually run the change detector as tile clicks don't trigger it for performance reasons
  handleTileClick(pos: Pos): void {
    if (this.isInQuizMode()) {
      this.handleUserGuess(pos);
    } else {
      this.placeAtTile(pos);
    }

    this.changeDetectorRef.detectChanges();
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

  updateNeighbourVisitOrder(neighbourVisitOrder: Neighbour[]): void {
    this.neighbourVisitOrder = neighbourVisitOrder;
    this.markAnimationFramesForUpdate();
  }

  // Generate a maze using whatever algorithm and placement item the user has selected
  generateMaze(): void {
    this.moveStartAndGoalPosToRandomPositions();
    this.clearBarriersAndWeights();
    this.placeMazeInGrid();
  }

  placeMazeInGrid(): void {
    const maze = this.mazeGenItemToImpl.get(this.mazeGenItem)();

    this.gridPositions.forEach((rowPositions) =>
      rowPositions.forEach(({ row, col }) => {
        if (maze[row][col]) {
          this.handleTileClick({ row, col });
        }
      })
    );
  }

  moveStartAndGoalPosToRandomPositions(): void {
    this.setStartPos({
      row: randomIntBetween(0, HEIGHT / 3),
      col: randomIntBetween(0, WIDTH / 3),
    });

    this.setGoalPos({
      row: randomIntBetween((HEIGHT * 2) / 3, HEIGHT),
      col: randomIntBetween((WIDTH * 2) / 3, WIDTH),
    });
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
    if (this.algoItem === algoItem) {
      return;
    }

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
    if (this.neighboursItem === neighboursItem) {
      return;
    }

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
    if (!this.isGoalPos(pos)) {
      this.startPos = pos;
      this.markAnimationFramesForUpdate();
    }
  }

  setGoalPos(pos: Pos): void {
    if (!this.isStartPos(pos)) {
      this.goalPos = pos;
      this.markAnimationFramesForUpdate();
    }
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

  saveCurrentGridState(saveName: string): void {
    addItemToLocalStorage(saveName + START_POS_STR, this.startPos);
    addItemToLocalStorage(saveName + GOAL_POS_STR, this.goalPos);
    addItemToLocalStorage(saveName + GRID_WEIGHTS_STR, this.gridWeights);
    addItemToLocalStorage(saveName + GRID_BARRIERS_STR, this.gridBarriers);
    this.addSaveNameToListOfSaveNames(saveName);
  }

  addSaveNameToListOfSaveNames(saveName: string): void {
    const saveNames = parseLocalStorageItem(SAVE_NAMES_STR);

    saveNames.unshift(saveName);
    addItemToLocalStorage(SAVE_NAMES_STR, removeStrDuplicates(saveNames));
  }

  deleteSavedGridState(saveName: string): void {
    const saveNames = parseLocalStorageItem(SAVE_NAMES_STR);

    removeItemFromArray(saveNames, saveName);
    addItemToLocalStorage(SAVE_NAMES_STR, saveNames);
  }

  loadSavedGridState(saveName: string): void {
    const startPos = parseLocalStorageItem(saveName + START_POS_STR);
    const goalPos = parseLocalStorageItem(saveName + GOAL_POS_STR);
    const gridBarriers = parseLocalStorageItem(saveName + GRID_BARRIERS_STR);
    const gridWeights = parseLocalStorageItem(saveName + GRID_WEIGHTS_STR);

    if (startPos && goalPos && gridBarriers && gridWeights) {
      this.setStartPos(movePositionWithinBoundsOfGrid(startPos));
      this.setGoalPos(movePositionWithinBoundsOfGrid(goalPos));
      this.setGridBarriers(adaptDimensionsToCurrGrid(gridBarriers, false));
      this.setGridWeights(adaptDimensionsToCurrGrid(gridWeights, 1));
    }
  }

  saveUserOptions(): void {
    const pathfindingOptions = {
      algoItem: this.algoItem,
      tileDisplayItem: this.tileDisplayItem,
      neighboursItem: this.neighboursItem,
      tilePlaceItem: this.tilePlaceItem,
      mazeGenItem: this.mazeGenItem,
      neighbourVisitOrder: this.neighbourVisitOrder,
    };

    addItemToLocalStorage(PATHFINDING_OPTIONS_STR, pathfindingOptions);
  }

  isDisplayingWeights(): boolean {
    return this.tileDisplayItem === TileDisplayItem.Weights;
  }

  @HostListener('window:pagehide', ['$event'])
  saveAppStateBeforeClose(): void {
    this.saveCurrentGridState(AUTO_GENERATED_SAVE_STR);
    this.saveUserOptions();
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
  NeighbourVisitOrder,
  None,
}
