import { Component, Input, EventEmitter, Output } from '@angular/core';
import {
  DataHiddenForUserGuess,
  SVGNode,
  SVG_NODE_RADIUS,
} from '../../models/animation';

@Component({
  selector: '[app-node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css'],
})
export class NodeComponent {
  // The node with data for displaying as an SVG and the internal data for visualising
  @Input() readonly svgNode!: SVGNode;

  // The colour the node will be displayed as on the screen
  @Input() readonly nodeColor!: string;

  // The orientation of this node, either MIN or MAX
  @Input() readonly orientationDisplay!: string;

  // True if user currently has alpha beta pruning mode selected, otherwise false
  @Input() readonly isUsingAlphaBetaPruning!: boolean;

  // True if node has no children
  @Input() readonly isLeafNode!: boolean;

  // Notify parent component that a correct guess has been made
  @Output() readonly correctGuessEmitter = new EventEmitter<SVGNode>();

  // Notify parent component that an incorrect guess has been made
  @Output() readonly incorrectGuessEmitter = new EventEmitter<SVGNode>();

  // The width of node's display in pixels
  readonly SVG_NODE_RADIUS = SVG_NODE_RADIUS;

  readonly Number = Number;

  // True if user has clicked on a node in order to make a guess, displaying the menu
  hasUserSetGuessInputToDisplay = false;

  // Invert hasUserSetGuessInputToDisplay
  toggleGuessInputDisplaySelection(): void {
    this.hasUserSetGuessInputToDisplay = !this.hasUserSetGuessInputToDisplay;
  }

  // Return the symbol that should be displayed for the nodes alpha value
  getAlphaDisplay(): string {
    return this.svgNode.dataHiddenForUserGuess === DataHiddenForUserGuess.Alpha
      ? '?'
      : this.svgNode.internalNode.alpha + '';
  }

  // Return the symbol that should be displayed for the nodes beta value
  getBetaDisplay(): string {
    return this.svgNode.dataHiddenForUserGuess === DataHiddenForUserGuess.Beta
      ? '?'
      : this.svgNode.internalNode.beta + '';
  }

  // Return the symbol that should be displayed for the nodes main value
  getValDisplay(): string {
    return this.svgNode.dataHiddenForUserGuess === DataHiddenForUserGuess.Val
      ? '?'
      : this.svgNode.internalNode.val + '';
  }

  // Return true if node has any data hidden for the purposes of quizzing the user
  isDataHiddenForUserGuess(): boolean {
    return this.svgNode.dataHiddenForUserGuess !== DataHiddenForUserGuess.None;
  }

  // Return the x coordinate of the quiz guess menu
  getUserGuessInputXCoord(): string {
    return (this.svgNode.centerX + 45).toString();
  }

  // Return the y coordinate of the quiz guess menu
  getUserGuessInputYCoord(): string {
    return (this.svgNode.centerY - 50).toString();
  }

  // Return true if the quiz guess menu should be displayed
  isDisplayingGuessInput(): boolean {
    return (
      this.hasUserSetGuessInputToDisplay && this.isDataHiddenForUserGuess()
    );
  }

  // Return the value that the user is required to guess
  getValueToGuess(): number | null {
    switch (this.svgNode.dataHiddenForUserGuess) {
      case DataHiddenForUserGuess.Alpha:
        return this.svgNode.internalNode.alpha;
      case DataHiddenForUserGuess.Beta:
        return this.svgNode.internalNode.beta;
      default:
        return this.svgNode.internalNode.val;
    }
  }

  // Test if user has made a correct guess and route appropiately
  handleUserGuess(value: number): void {
    if (value === this.getValueToGuess()) {
      this.notifyCorrectGuess();
    } else {
      this.notifyIncorrectGuess();
    }
  }

  // Notify parent component that a correct guess has been made
  notifyCorrectGuess(): void {
    this.correctGuessEmitter.emit(this.svgNode);
  }

  // Notify parent component that an incorrect guess has been made
  notifyIncorrectGuess(): void {
    this.incorrectGuessEmitter.emit(this.svgNode);
  }
}
