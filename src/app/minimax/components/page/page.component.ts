import { Component, HostListener, OnInit } from '@angular/core';
import {
  addItemToLocalStorage,
  arrayOfRandomIntsBetween,
  assertDefined,
  isWidthGreaterThan,
  parseLocalStorageItem,
  randomIntBetween,
  safeGetArrayIndex,
} from 'src/app/shared/genericUtils';
import { minimax } from '../../algos/minimax';
import {
  treeAnimationFrameToSVGAnimationframe,
  SVGTreeAnimationFrame,
  SVG_HEIGHT,
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
  // An enum of the different modals that can be displayed on this page
  readonly Modal = Modal;

  // Height of SVG canvas in pixels
  readonly SVG_HEIGHT = SVG_HEIGHT;

  // Width of SVG canvas in pixels
  readonly SVG_WIDTH = SVG_WIDTH;

  // Tests if a given node has no children
  readonly isLeafNode = isLeafNode;

  // A enumeration of the slides in the page's tutorial modal
  readonly tutorialModalSlides = Object.values(TutorialModalSlide);

  // A enumeration of the items in the page's pruning heuristic dropdown menu
  readonly pruningHeuristicItems = Object.values(PruningHeuristicItem);

  // A enumeration of the items in the page's user interaction mode dropdown menu
  readonly userInteractionModeItems = Object.values(UserInteractionModeItem);

  readonly isWidthGreaterThan = isWidthGreaterThan;

  // The list of animation frames corresponding to the current problem config
  animationFrames: SVGTreeAnimationFrame[] = [];

  // True if an animation is running, otherwise false
  isAnimationRunning = false;

  // An index into the animationFrames list that controls which animation frame is currently being displayed
  animationIndex = 0;

  // True if animation frames have been marked for updating as a result user changing the problem config
  needToUpdateAnimationFrames = true;

  // The current modal being displayed on the screen
  modalDisplayed = Modal.Tutorial;

  // The current heuristic item selected in the dropdown menu
  pruningHeuristicItem = PruningHeuristicItem.None;

  // The user interaction mode item selected in the dropdown menu
  userInteractionModeItem = UserInteractionModeItem.Visualise;

  // The leaf values for the minimax tree for the current problem config
  leafValues = this.fillLeafValues([]);

  // The type of commentary that is currently being displayed on the screen
  commentaryType = CommentaryType.AlgoStep;

  // True if user is currently displaying the legend chart by hovering, otherwise false
  isLegendDisplayed = false;

  // Invert isLegendDisplayed variable
  toggleLegendDisplay(): void {
    this.isLegendDisplayed = !this.isLegendDisplayed;
  }

  // When component renders, update the animation frames
  ngOnInit(): void {
    this.loadDropdownOptions();
    this.updateAnimationFramesIfNeeded();
  }

  loadDropdownOptions(): void {
    if (parseLocalStorageItem('pruningHeuristicItem') !== null) {
      this.pruningHeuristicItem = parseLocalStorageItem('pruningHeuristicItem');
      this.leafValues = parseLocalStorageItem('leafValues');
      this.commentaryType = parseLocalStorageItem('commentaryType');
      this.userInteractionModeItem = parseLocalStorageItem(
        'userInteractionModeItem'
      );
    }
  }

  // Update the animation frames if problem config has changed
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

  // Transform the current list of animation frames to hide some data for the user to guess for the final frame
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

  // For each node in the tree, randomly mark some data to hide for the user to guess
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

  // Transform a given frame to hide some data for the user to guess
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

  // Update the leaf values with the list entered by the user in the EnterLeafValues modal
  updateLeafValuesWithUserEnteredList(leafValues: number[]): void {
    this.leafValues = this.fillLeafValues(leafValues);
    this.markAnimationFramesForUpdate();
  }

  // Pad the leafValues list with random numbers if it's smaller than required
  fillLeafValues(leafValues: number[]): number[] {
    const numberOfLeavesToAdd = LEAF_COUNT - leafValues.length;

    return leafValues.concat(
      numberOfLeavesToAdd > 0
        ? arrayOfRandomIntsBetween(1, 100, numberOfLeavesToAdd)
        : []
    );
  }

  // Update the leaf values with an entirely randomly generated list
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

  // Return the animation index, moving it within bounds of animationFrames array if it's out of bounds
  safeGetAnimationIndex(): number {
    return safeGetArrayIndex(this.animationFrames, this.animationIndex);
  }

  getCurrentAnimationFrame(): SVGTreeAnimationFrame {
    return this.animationFrames[this.safeGetAnimationIndex()];
  }

  // Return the CSS class of a node, affecting how it's displayed
  getNodeClass(node: Node): string {
    return node.id === this.getCurrentAnimationFrame().currNodeId
      ? 'opacity-highlight stroke-black'
      : '';
  }

  // Return whether a node is a MIN or MAX node depending on it's depth in the tree
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

  // Reset animation state and update the animation frames
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

  // Display some commentary informing the user of the outcome of their guess for a second
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

  // Update the animation frame list to reveal the data for a node that was previously hidden
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

  saveDropdownOptions(): void {
    addItemToLocalStorage('pruningHeuristicItem', this.pruningHeuristicItem);
    addItemToLocalStorage('leafValues', this.leafValues);
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
  EnterLeafValues,
  None,
}
