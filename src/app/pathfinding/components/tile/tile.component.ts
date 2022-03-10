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

  @Input() readonly isStart!: boolean;

  @Input() readonly isGoal!: boolean;

  @Input() readonly isBarrier!: boolean;

  @Input() readonly weight!: number;

  @Input() readonly dist!: number;

  @Input() readonly heuristicDist!: number;

  @Input() readonly displayItem!: TileDisplayItem;

  @Input() readonly willDisplayTooltipOnMouseOver!: boolean;

  @Input() readonly animationFrame!: TileAnimationFrame;

  @Input() readonly pos!: Pos;

  @Input() readonly isInQuizMode!: boolean;

  @Output() readonly dragEmitter = new EventEmitter<TileEvent>();

  @Output() readonly dropEmitter = new EventEmitter<TileEvent>();

  @Output() readonly clickEmitter = new EventEmitter<TileEvent>();

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

  readonly displayItemToColor = new UncheckedObjMap<TileDisplayItem, string>([
    [TileDisplayItem.Dists, '#006633'],
    [TileDisplayItem.Weights, 'var(--secondary-color)'],
    [TileDisplayItem.Heuristics, 'red'],
  ]);

  readonly animationFramesToHighlight = [
    TileAnimationFrame.BeingAddedToAgenda,
    TileAnimationFrame.BeingExpanded,
  ];

  isMouseOver = false;

  getClass(): string {
    let classStr = 'tile';

    if (this.shouldTileBeHighlighted()) {
      classStr += ' pulse-highlight';
      classStr += ' black-border';
    }

    return classStr;
  }

  shouldTileBeHighlighted(): boolean {
    return (
      this.animationFramesToHighlight.includes(this.animationFrame) &&
      !this.isInQuizMode
    );
  }

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
    this.dragEmitter.emit({ pos: this.pos, event });
  }

  notifyDrop(event: Event): void {
    this.dropEmitter.emit({ pos: this.pos, event });
  }

  notifyClick(event: Event): void {
    this.clickEmitter.emit({ pos: this.pos, event });
  }

  notifyClickIfMouseDown(event: Event): void {
    if (this.isMouseDown) {
      this.notifyClick(event);
    }
  }
}

export type TileEvent = {
  pos: Pos;
  event: Event;
};
