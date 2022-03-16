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
  genRandomMaze,
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
import { TileEvent } from '../tile/tile.component';
import { computeManhattanDist } from 'src/app/pathfinding/algos/cmps';
import { UncheckedObjMap } from 'src/app/shared/models/uncheckedObjMap';
import { safeGetArrayIndex } from 'src/app/shared/genericUtils';
import { TutorialModalSlide } from '../tutorial-modal/tutorial-modal.component';
import cloneDeep from 'clone-deep';
import {
  genAstarQuizCase,
  genDijsktraQuizCase,
  genGBFSQuizCase,
  QuizCase,
} from '../../models/quizCases';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnInit {
  readonly gridPositions = initGridPositions();

  readonly Modal = Modal;

  readonly trackByPos = genUniquePosId;

  readonly trackByRow = genUniqueRowId;

  readonly tilePlaceItems = Object.values(TilePlaceItem);

  readonly algoItems = Object.values(AlgoItem);

  readonly quizzableAlgoItems = Object.values(QuizzableAlgoItem);

  readonly mazeGenItems = Object.values(MazeGenItem);

  readonly neighboursItems = Object.values(NeighboursItem);

  readonly tileDisplayItems = Object.values(TileDisplayItem);

  readonly userInteractionModeItems = Object.values(UserInteractionModeItem);

  readonly tutorialModalSlides = Object.values(TutorialModalSlide);

  readonly tilePlaceItemToImpl = new UncheckedObjMap<
    TilePlaceItem,
    (pos: Pos) => void
  >([
    [TilePlaceItem.Barriers, this.toggleBarrier],
    [TilePlaceItem.Weights, this.toggleWeight],
  ]);

  readonly mazeGenItemToImpl = new UncheckedObjMap<MazeGenItem, () => Maze>([
    [MazeGenItem.Random, genRandomMaze],
    [MazeGenItem.FillGrid, genFilledGridMaze],
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

  gridWeights = initBlankGridWeights();

  gridBarriers = initBlankGridBarriers();

  animationFrames = [initBlankGridAnimationFrame()];

  isAnimationRunning = false;

  animationIndex = 0;

  needToUpdateAnimationFrames = true;

  startPos = DEFAULT_START_POS;

  goalPos = DEFAULT_GOAL_POS;

  isMouseDown = false;

  tilePlaceItem = TilePlaceItem.Barriers;

  userInteractionModeItem = UserInteractionModeItem.Visualise;

  mazeGenItem = MazeGenItem.Random;

  algoItem = AlgoItem.BFS;

  neighboursItem = NeighboursItem.NonDiagonals;

  tileDisplayItem = TileDisplayItem.Weights;

  modalDisplayed = Modal.Tutorial;

  commentaryType = CommentaryType.AlgoStep;

  constructor(public dragAndDropService: TileDragAndDropService) {}

  ngOnInit(): void {
    this.updateAnimationFramesIfNeeded();
  }

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

  safeGetAnimationIndex(): number {
    return safeGetArrayIndex(this.animationFrames, this.animationIndex);
  }

  getCurrentAnimationFrame(): GridAnimationFrame {
    return this.animationFrames[this.safeGetAnimationIndex()];
  }

  handleTileDrag(tileEvent: TileEvent): void {
    this.dragAndDropService.handleDrag(tileEvent, this.startPos, this.goalPos);
  }

  handleTileDrop(pos: Pos): void {
    const draggedFromPos = this.dragAndDropService.getDraggedFromPos();

    if (this.canDropAtPos(pos) && draggedFromPos !== null) {
      this.updatePositionsFromDrop(draggedFromPos, pos);
    }

    this.toggleMouseDown();
  }

  handleTileClick(pos: Pos): void {
    if (this.isInQuizMode()) {
      this.handleUserGuess(pos);
    } else {
      this.placeAtTile(pos);
    }
  }

  handleUserGuess(pos: Pos): void {
    if (isSamePos(pos, this.getTileBeingExpanded())) {
      this.handleCorrectGuess();
    } else {
      this.commentaryType = CommentaryType.IncorrectGuess;
    }
  }

  handleCorrectGuess(): void {
    if (this.hasPathBeenFoundForNextAnimationFrame()) {
      this.setAnimationIndex(this.animationFrames.length - 1);
      this.commentaryType = CommentaryType.GuessedAllCorrect;
    } else {
      this.setAnimationIndex(this.animationIndex + 2);
      this.commentaryType = CommentaryType.CorrectGuess;
    }
  }

  hasPathBeenFoundForNextAnimationFrame(): boolean {
    return this.animationFrames[this.animationIndex + 2].grid.some((row) =>
      row.some((tile) => tile === TileAnimationFrame.FinalPath)
    );
  }

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

  toggleBarrier({ row, col }: Pos): void {
    const gridBarriersCopy = cloneDeep(this.gridBarriers);

    gridBarriersCopy[row][col] = !gridBarriersCopy[row][col];

    this.setGridBarriers(gridBarriersCopy);
  }

  toggleWeight({ row, col }: Pos): void {
    const gridWeightsCopy = cloneDeep(this.gridWeights);

    if (gridWeightsCopy[row][col] === DEFAULT_WEIGHT) {
      gridWeightsCopy[row][col] = genRandomWeight();
    } else {
      gridWeightsCopy[row][col] = DEFAULT_WEIGHT;
    }

    this.setTileDisplayItem(TileDisplayItem.Weights);
    this.setGridWeights(gridWeightsCopy);
  }

  isStartPos(pos: Pos): boolean {
    return isSamePos(this.startPos, pos);
  }

  isGoalPos(pos: Pos): boolean {
    return isSamePos(this.goalPos, pos);
  }

  updatePositionsFromDrop(draggedFromPos: Pos, droppedAtPos: Pos): void {
    if (isSamePos(draggedFromPos, this.startPos)) {
      this.startPos = droppedAtPos;
    } else {
      this.goalPos = droppedAtPos;
    }

    this.markAnimationFramesForUpdate();
  }

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

  setUpQuizModeForCurrentAlgoItem(): void {
    if (!this.isAlgoItemQuizzable()) {
      this.algoItem = AlgoItem.Dijkstras;
    }

    this.commentaryType = CommentaryType.GuessExplanation;
    this.setUpQuizCase();
    this.updateAnimationFramesIfNeeded();
  }

  isAlgoItemQuizzable(): boolean {
    return this.quizzableAlgoItems
      .map((item) => item.toString())
      .includes(this.algoItem.toString());
  }

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

  @HostListener('mousedown', ['$event'])
  @HostListener('mouseup', ['$event'])
  toggleMouseDownFromEvent(event: MouseEvent): void {
    this.isMouseDown = event.buttons === 1;
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
  None,
}
