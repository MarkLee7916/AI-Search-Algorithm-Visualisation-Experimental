import { Injectable } from '@angular/core';
import { TileEvent } from '../components/tile/tile.component';
import { GridBarriers, isSamePos, Pos } from '../models/grid';

@Injectable({
  providedIn: 'root',
})
export class TileDragAndDropService {
  // The tile that has been dragged but not dropped yet
  private draggedFrom: Pos | null;

  constructor() {
    this.draggedFrom = null;
  }

  // Handle the cases where a drag is considered either valid or invalid
  public handleDrag(tileEvent: TileEvent, startPos: Pos, goalPos: Pos): void {
    const { pos, event } = tileEvent;

    if (this.canDragFrom(pos, startPos, goalPos)) {
      this.draggedFrom = pos;
    } else {
      this.draggedFrom = null;
      event.preventDefault();
    }
  }

  // True if a drop is considered valid
  public canDrop(
    pos: Pos,
    gridBarriers: GridBarriers,
    startPos: Pos,
    goalPos: Pos
  ): boolean {
    return (
      !isSamePos(startPos, pos) &&
      !isSamePos(goalPos, pos) &&
      !gridBarriers[pos.row][pos.col]
    );
  }

  public getDraggedFromPos(): Pos | null {
    return this.draggedFrom;
  }

  private canDragFrom(pos: Pos, startPos: Pos, goalPos: Pos): boolean {
    return isSamePos(pos, startPos) || isSamePos(pos, goalPos);
  }
}
