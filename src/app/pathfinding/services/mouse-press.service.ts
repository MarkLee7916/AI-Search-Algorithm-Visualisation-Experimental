import { Injectable, NgZone } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MousePressService {
  private isMouseDown = false;

  constructor(private zone: NgZone) {
    this.zone.runOutsideAngular(() => {
      fromEvent(document, 'mousedown').subscribe(this.handlePress.bind(this));
      fromEvent(document, 'mouseup').subscribe(this.handlePress.bind(this));
    });
  }

  public getMouseDown(): boolean {
    return this.isMouseDown;
  }

  public toggleMouseDown(): void {
    this.isMouseDown = !this.isMouseDown;
  }

  private handlePress(event: Event): void {
    this.isMouseDown = (event as MouseEvent).buttons === 1;
  }
}
