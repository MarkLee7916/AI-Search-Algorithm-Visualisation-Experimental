import { Component, Input } from '@angular/core';

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

  @Input() readonly row!: number;

  @Input() readonly col!: number;

  getBackgroundColor(): string {
    if (this.isDomainHighlighted) {
      return '#32CD32';
    } else if (this.isPrunedFromDomainHighlighted) {
      return 'white';
    } else {
      return (this.row + this.col) % 2 === 0 ? 'white' : '#C4A484';
    }
  }
}
