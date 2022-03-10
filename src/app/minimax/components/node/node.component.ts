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
  @Input() readonly svgNode!: SVGNode;

  @Input() readonly nodeColor!: string;

  @Input() readonly orientationDisplay!: string;

  @Input() readonly isUsingAlphaBetaPruning!: boolean;

  @Input() readonly isLeafNode!: boolean;

  @Output() readonly correctGuessEmitter = new EventEmitter<SVGNode>();

  @Output() readonly incorrectGuessEmitter = new EventEmitter<SVGNode>();

  readonly SVG_NODE_RADIUS = SVG_NODE_RADIUS;

  readonly Number = Number;

  hasUserSetGuessInputToDisplay = false;

  toggleGuessInputDisplaySelection(): void {
    this.hasUserSetGuessInputToDisplay = !this.hasUserSetGuessInputToDisplay;
  }

  getAlphaDisplay(): string {
    return this.svgNode.dataHiddenForUserGuess === DataHiddenForUserGuess.Alpha
      ? '?'
      : this.svgNode.internalNode.alpha + '';
  }

  getBetaDisplay(): string {
    return this.svgNode.dataHiddenForUserGuess === DataHiddenForUserGuess.Beta
      ? '?'
      : this.svgNode.internalNode.beta + '';
  }

  getValDisplay(): string {
    return this.svgNode.dataHiddenForUserGuess === DataHiddenForUserGuess.Val
      ? '?'
      : this.svgNode.internalNode.val + '';
  }

  isDataHiddenForUserGuess(): boolean {
    return this.svgNode.dataHiddenForUserGuess !== DataHiddenForUserGuess.None;
  }

  getUserGuessInputXCoord(): string {
    return (this.svgNode.centerX + 45).toString();
  }

  getUserGuessInputYCoord(): string {
    return (this.svgNode.centerY - 50).toString();
  }

  isDisplayingGuessInput(): boolean {
    return (
      this.hasUserSetGuessInputToDisplay && this.isDataHiddenForUserGuess()
    );
  }

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

  handleUserGuess(value: number): void {
    if (value === this.getValueToGuess()) {
      this.notifyCorrectGuess();
    } else {
      this.notifyIncorrectGuess();
    }
  }

  notifyCorrectGuess(): void {
    this.correctGuessEmitter.emit(this.svgNode);
  }

  notifyIncorrectGuess(): void {
    this.incorrectGuessEmitter.emit(this.svgNode);
  }
}
