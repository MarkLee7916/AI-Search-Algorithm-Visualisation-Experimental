import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pos } from '../../models/board';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
})
export class TileComponent {
  @Input() readonly sizeInPx!: number;

  @Input() readonly hasQueen!: boolean;

  @Input() readonly isDomainHighlighted!: boolean;

  @Input() readonly isPrunedFromDomainHighlighted!: boolean;

  @Input() readonly pos!: Pos;

  @Input() readonly isInQuizMode!: boolean;

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
