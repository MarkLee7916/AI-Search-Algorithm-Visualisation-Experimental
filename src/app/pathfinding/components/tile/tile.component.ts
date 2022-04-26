import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Pos, TileAnimationFrame } from 'src/app/pathfinding/models/grid';
import { TileDisplayItem } from 'src/app/pathfinding/models/dropdownItemEnums';
import { UncheckedObjMap } from 'src/app/shared/models/uncheckedObjMap';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileComponent {
  @Input() readonly isMouseDown!: boolean;

  // True if this tile is the source tile the algorithm searches from
  @Input() readonly isStart!: boolean;

  // True if this tile is the target tile the algorithm tries to find a path to
  @Input() readonly isGoal!: boolean;

  // True if this tile has a barrier obstructing the algorithm from passing
  @Input() readonly isBarrier!: boolean;

  // The weight of this tile for weighted algorithms to consider, 1 by default
  @Input() readonly weight!: number;

  // The weighted distance from the start tile to this tile
  @Input() readonly dist!: number;

  // The manhattan distance from this tile to the goal tile
  @Input() readonly heuristicDist!: number;

  // The type of data displayed on this tile. Either weight, dist or heuristicDist
  @Input() readonly displayItem!: TileDisplayItem;

  // True if hovering over this tile will cause its tooltip to be displayed
  @Input() readonly willDisplayTooltipOnMouseOver!: boolean;

  // The current animation frames value for this particular tile
  @Input() readonly animationFrame!: TileAnimationFrame;

  // This tiles position on the grid
  @Input() readonly pos!: Pos;

  // True if app is in quiz mode
  @Input() readonly isInQuizMode!: boolean;

  @Input() readonly shouldDisplayCustomWeightInput!: boolean;

  // Event emitter for when the user drags this tile
  @Output() readonly dragEmitter = new EventEmitter<Event>();

  // Event emitter for when the user drops another tile onto this one
  @Output() readonly dropEmitter = new EventEmitter<Event>();

  // Event emitter for when the user clicks this tile
  @Output() readonly clickEmitter = new EventEmitter<Event>();

  // Event emitter for when the user enters a custom weight and submits it
  @Output() readonly submitCustomWeightEmitter = new EventEmitter<number>();

  @Output() readonly closeCustomWeightInputEmitter = new EventEmitter<void>();

  // Map the type of animation on this tile to the colour its background will be displayed in
  readonly animationFrameToColor = new UncheckedObjMap<
    TileAnimationFrame,
    string
  >([
    [TileAnimationFrame.Blank, 'white'],
    [TileAnimationFrame.Expanded, '#7FCDCD'],
    [TileAnimationFrame.FinalPath, '#EFC050'],
    [TileAnimationFrame.Visited, '#F7CAC9'],
    [TileAnimationFrame.BeingAddedToAgenda, '#F7CAC9'],
    [TileAnimationFrame.BeingExpanded, '#7FCDCD'],
  ]);

  // Map a display string on the tile onto the colour it will be displayed in
  readonly displayItemToColor = new UncheckedObjMap<TileDisplayItem, string>([
    [TileDisplayItem.Dists, '#006633'],
    [TileDisplayItem.Weights, 'var(--secondary-color)'],
    [TileDisplayItem.Heuristics, 'red'],
  ]);

  // The animation frames where the tile has additional styles applied to it to highlight it
  readonly animationFramesToHighlight = [
    TileAnimationFrame.BeingAddedToAgenda,
    TileAnimationFrame.BeingExpanded,
  ];

  // True if the mouse is currently hovering over this tile
  isMouseOver = false;

  // Get the class of this tile to configure how its displayed in CSS
  getClass(): string {
    let classStr = 'tile';

    if (this.shouldTileBeHighlighted()) {
      classStr += ' pulse-highlight';
      classStr += ' black-border';
    }

    return classStr;
  }

  // True if tile will be highlighted, otherwise false
  shouldTileBeHighlighted(): boolean {
    return (
      this.animationFramesToHighlight.includes(this.animationFrame) &&
      !this.isInQuizMode
    );
  }

  // Compute the string that will be displayed on this tile
  getDisplayStr(): string {
    if (this.displayItem === TileDisplayItem.Dists) {
      return this.getDistDisplayStr();
    } else if (this.displayItem === TileDisplayItem.Weights) {
      return this.weight === 1 ? '' : this.weight.toString();
    } else if (this.displayItem === TileDisplayItem.Heuristics) {
      return this.heuristicDist.toString();
    } else {
      throw new Error('Tile display item not supported!');
    }
  }

  // If displaying the distance from the start, compute the string that will be displayed on this tile
  getDistDisplayStr(): string {
    return this.dist !== Number.POSITIVE_INFINITY ? this.dist.toString() : '∞';
  }

  getBackgroundColor(): string {
    if (this.isBarrier) {
      return 'gray';
    } else {
      return this.animationFrameToColor.get(this.animationFrame);
    }
  }

  handleMouseOver(event: Event): void {
    this.isMouseOver = true;
    this.notifyClickIfMouseDown(event);
  }

  handleMouseLeave(): void {
    this.isMouseOver = false;
  }

  handleDrag(event: Event): void {
    this.handleMouseLeave();
    this.notifyDrag(event);
  }

  notifyDrag(event: Event): void {
    this.dragEmitter.emit(event);
  }

  notifyDrop(event: Event): void {
    this.dropEmitter.emit(event);
  }

  notifyClick(event: Event): void {
    this.clickEmitter.emit(event);
  }

  notifyClickIfMouseDown(event: Event): void {
    if (this.isMouseDown) {
      this.notifyClick(event);
    }
  }

  submitCustomWeight(customWeight: number): void {
    this.submitCustomWeightEmitter.emit(customWeight);
  }

  closeCustomWeightInput(): void {
    this.closeCustomWeightInputEmitter.emit();
  }
}
