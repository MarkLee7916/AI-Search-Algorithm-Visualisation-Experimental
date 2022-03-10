import { Component, OnInit } from '@angular/core';
import {
  arrayOfRandomIntsBetween,
  assertDefined,
  randomIntBetween,
  safeGetArrayIndex,
} from 'src/app/shared/genericUtils';
import { minimax } from '../../algos/minimax';
import {
  treeAnimationFrameToSVGAnimationframe,
  SVGTreeAnimationFrame,
  SVG_HEIGHT,
  SVG_TRANSFORM_SCALE,
  SVG_WIDTH,
  DataHiddenForUserGuess,
  SVGNode,
} from '../../models/animation';
import {
  PruningHeuristicItem,
  UserInteractionModeItem,
} from '../../models/dropdownItemEnums';
import {
  isLeafNode,
  isRootNode,
  LEAF_COUNT,
  Node,
  TREE_DEPTH,
} from '../../models/tree';
import { TutorialModalSlide } from '../tutorial-modal/tutorial-modal.component';
import cloneDeep from 'clone-deep';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
})
export class PageComponent implements OnInit {
  readonly Modal = Modal;

  readonly SVG_HEIGHT = SVG_HEIGHT;

  readonly SVG_WIDTH = SVG_WIDTH;

  readonly SVG_TRANSFORM_SCALE = SVG_TRANSFORM_SCALE;

  readonly isLeafNode = isLeafNode;

  readonly tutorialModalSlides = Object.values(TutorialModalSlide);

  readonly pruningHeuristicItems = Object.values(PruningHeuristicItem);

  readonly userInteractionModeItems = Object.values(UserInteractionModeItem);

  animationFrames: SVGTreeAnimationFrame[] = [];

  isAnimationRunning = false;

  animationIndex = 0;

  needToUpdateAnimationFrames = true;

  modalDisplayed = Modal.Tutorial;

  pruningHeuristicItem = PruningHeuristicItem.None;

  userInteractionModeItem = UserInteractionModeItem.Visualise;

  leafValues = this.fillLeafValues([]);

  commentaryType = CommentaryType.AlgoStep;

  isLegendDisplayed = false;

  toggleLegendDisplay(): void {
    this.isLegendDisplayed = !this.isLegendDisplayed;
  }

  ngOnInit(): void {
    this.updateAnimationFramesIfNeeded();
  }

  updateAnimationFramesIfNeeded(): void {
    if (this.needToUpdateAnimationFrames) {
      const frames = minimax(
        [...this.leafValues],
        this.isUsingAlphaBetaPruning()
      );
      const svgFrames = frames.map(treeAnimationFrameToSVGAnimationframe);

      if (this.isInQuizMode()) {
        this.animationFrames = this.hideTreeDataForUserToGuess(svgFrames);
        this.setAnimationIndex(this.animationFrames.length - 1);
      } else {
        this.animationFrames = svgFrames;
      }
    }

    this.needToUpdateAnimationFrames = false;
  }

  hideTreeDataForUserToGuess(
    animationFrames: SVGTreeAnimationFrame[]
  ): SVGTreeAnimationFrame[] {
    const animationFramesCopy = cloneDeep(animationFrames);
    const dataToHideForEachNode = this.genDataToHideForEachNode();

    animationFramesCopy[animationFramesCopy.length - 1] =
      this.hideTreeDataForFrame(
        animationFramesCopy[animationFramesCopy.length - 1],
        dataToHideForEachNode
      );

    return animationFramesCopy;
  }

  genDataToHideForEachNode(): DataHiddenForUserGuess[] {
    const dataToHideForEachNode: DataHiddenForUserGuess[] = [];

    for (let i = 0; i < LEAF_COUNT - 1; i++) {
      const randomSeed = randomIntBetween(0, 3);

      if (randomSeed === 0 && this.isUsingAlphaBetaPruning()) {
        dataToHideForEachNode.push(DataHiddenForUserGuess.Alpha);
      } else if (randomSeed === 1 && this.isUsingAlphaBetaPruning()) {
        dataToHideForEachNode.push(DataHiddenForUserGuess.Beta);
      } else {
        dataToHideForEachNode.push(DataHiddenForUserGuess.Val);
      }
    }

    return dataToHideForEachNode;
  }

  hideTreeDataForFrame(
    frame: SVGTreeAnimationFrame,
    dataToHideForEachNode: DataHiddenForUserGuess[]
  ): SVGTreeAnimationFrame {
    frame.tree.nodes
      .filter(
        ({ internalNode }) =>
          !isLeafNode(internalNode) &&
          !isRootNode(internalNode) &&
          internalNode.hasBeenConsidered
      )
      .forEach((node, i) => {
        node.dataHiddenForUserGuess = dataToHideForEachNode[i];
      });

    return frame;
  }

  updateLeafValuesWithUserEnteredList(leafValues: number[]): void {
    this.leafValues = this.fillLeafValues(leafValues);
    this.markAnimationFramesForUpdate();
  }

  fillLeafValues(leafValues: number[]): number[] {
    const numberOfLeavesToAdd = LEAF_COUNT - leafValues.length;

    return leafValues.concat(
      numberOfLeavesToAdd > 0
        ? arrayOfRandomIntsBetween(1, 100, numberOfLeavesToAdd)
        : []
    );
  }

  updateLeafValuesWithGeneratedList(): void {
    this.leafValues = this.fillLeafValues([]);
    this.markAnimationFramesForUpdate();
  }

  hideModal(): void {
    this.setModalDisplayed(Modal.None);
  }

  setModalDisplayed(modal: Modal): void {
    this.modalDisplayed = modal;
  }

  setAnimationRunning(running: boolean): void {
    this.isAnimationRunning = running;
  }

  setAnimationIndex(index: number): void {
    this.animationIndex = index;
  }

  safeGetAnimationIndex(): number {
    return safeGetArrayIndex(this.animationFrames, this.animationIndex);
  }

  getCurrentAnimationFrame(): SVGTreeAnimationFrame {
    return this.animationFrames[this.safeGetAnimationIndex()];
  }

  getNodeClass(node: Node): string {
    return node.id === this.getCurrentAnimationFrame().currNodeId
      ? 'opacity-highlight stroke-black'
      : '';
  }

  getOrientationDisplay(depth: number): string {
    if (depth === TREE_DEPTH) {
      return '';
    } else {
      return depth % 2 === 0 ? 'MAX' : 'MIN';
    }
  }

  getNodeColor(node: Node): string {
    return node.hasBeenConsidered ? '#4169e1' : '#ed2939';
  }

  isLastAnimationFrame(): boolean {
    return this.safeGetAnimationIndex() === this.animationFrames.length - 1;
  }

  setPruningHeuristicItem(pruningHeuristicItem: string): void {
    this.pruningHeuristicItem = pruningHeuristicItem as PruningHeuristicItem;
    this.markAnimationFramesForUpdate();
  }

  setUserInteractionModeItem(item: string): void {
    this.userInteractionModeItem = item as UserInteractionModeItem;
    this.markAnimationFramesForUpdate();

    if (this.userInteractionModeItem === UserInteractionModeItem.Quiz) {
      this.commentaryType = CommentaryType.GuessExplanation;
    } else {
      this.commentaryType = CommentaryType.AlgoStep;
    }
  }

  markAnimationFramesForUpdate(): void {
    this.needToUpdateAnimationFrames = true;
    this.setAnimationIndex(0);
    this.setAnimationRunning(false);
    this.updateAnimationFramesIfNeeded();
  }

  isUsingAlphaBetaPruning(): boolean {
    return this.pruningHeuristicItem === PruningHeuristicItem.AlphaBeta;
  }

  getCommentary(): string {
    switch (this.commentaryType) {
      case CommentaryType.AlgoStep:
        return this.getCurrentAnimationFrame().commentary;
      case CommentaryType.CorrectGuess:
        return 'Correct!';
      case CommentaryType.GuessedAllCorrect:
        return 'All guesses correct! Change the tree values to try again';
      case CommentaryType.GuessExplanation:
        return 'Click on a node with a "?" symbol and enter your guess for what the value should be in the bottom box, pressing the enter key to submit. You can use the first two buttons to guess ∞ or -∞';
      default:
        return 'Incorrect! Try again';
    }
  }

  isInQuizMode(): boolean {
    return this.userInteractionModeItem === UserInteractionModeItem.Quiz;
  }

  handleCorrectGuess({ internalNode }: SVGNode): void {
    this.unhideGuessData(internalNode);
    this.displayGuessCommentaryTemporarily(CommentaryType.CorrectGuess);
  }

  hasUserGuessedAllCorrect(): boolean {
    const finalFrame = this.animationFrames[this.animationFrames.length - 1];

    return finalFrame.tree.nodes.every((node) => !node.dataHiddenForUserGuess);
  }

  handleIncorrectGuess(): void {
    this.displayGuessCommentaryTemporarily(CommentaryType.IncorrectGuess);
  }

  displayGuessCommentaryTemporarily(commentaryType: CommentaryType): void {
    this.commentaryType = commentaryType;

    setTimeout(() => {
      if (this.hasUserGuessedAllCorrect()) {
        this.commentaryType = CommentaryType.GuessedAllCorrect;
      } else {
        this.commentaryType = CommentaryType.GuessExplanation;
      }
    }, 1000);
  }

  unhideGuessData(node: Node): void {
    const animationFrames = cloneDeep(this.animationFrames);

    animationFrames.forEach((frame) => {
      const nodeToUnhideDataOf = assertDefined(
        frame.tree.nodes.find(
          (nodeCopy) => nodeCopy.internalNode.id === node.id
        )
      );

      nodeToUnhideDataOf.dataHiddenForUserGuess = DataHiddenForUserGuess.None;
    });

    this.animationFrames = animationFrames;
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
  EnterLeafValues,
  None,
}
