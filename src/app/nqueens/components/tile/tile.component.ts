import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pos } from '../../models/board';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
})
export class TileComponent {
  // The length of this tile in pixels
  @Input() readonly sizeInPx!: number;

  // True if this tile has a queen placed on it
  @Input() readonly hasQueen!: boolean;

  // True if this tile should be highlighted as a part of its rows domain if "Display Domains of All Rows" is selected
  @Input() readonly isDomainHighlighted!: boolean;

  // True if this tile should be highlighted as part of its rows domain if "Display Domain Being Changed" is selected
  @Input() readonly isPrunedFromDomainHighlighted!: boolean;

  // The position of this tile on the screen
  @Input() readonly pos!: Pos;

  // True if clicking on this tile will trigger the appropiate callback
  @Input() readonly isClickable!: boolean;

  @Output() readonly clickEmitter = new EventEmitter<Pos>();

  getBackgroundColor(): string {
    if (this.isDomainHighlighted) {
      return '#32CD32';
    } else if (this.isPrunedFromDomainHighlighted) {
      return 'white';
    } else {
      return (this.pos.row + this.pos.col) % 2 === 0 ? 'white' : '#C4A484';
    }
  }

  notifyClick(): void {
    this.clickEmitter.emit(this.pos);
  }
}
