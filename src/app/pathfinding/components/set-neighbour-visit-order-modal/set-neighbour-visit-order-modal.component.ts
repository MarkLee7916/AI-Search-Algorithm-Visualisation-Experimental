import { Component, EventEmitter, Input, Output } from '@angular/core';
import cloneDeep from 'clone-deep';
import { AbstractModalComponent } from 'src/app/shared/components/abstract-modal/abstract-modal.component';
import { swap } from 'src/app/shared/genericUtils';
import { UncheckedObjMap } from 'src/app/shared/models/uncheckedObjMap';
import { Neighbour } from '../../models/grid';

@Component({
  selector: 'app-set-neighbour-visit-order-modal',
  templateUrl: './set-neighbour-visit-order-modal.component.html',
  styleUrls: [
    './set-neighbour-visit-order-modal.component.css',
    '../../../shared/components/abstract-modal/abstract-modal.component.css',
  ],
})
export class SetNeighbourVisitOrderModalComponent extends AbstractModalComponent {
  @Input() readonly neighbourVisitOrder!: Neighbour[];

  @Output() readonly updateNeighbourVisitOrderEmitter = new EventEmitter<
    Neighbour[]
  >();

  readonly neighbourToText = new UncheckedObjMap<Neighbour, string>([
    [{ vertical: -1, horizontal: -1 }, 'Top Left'],
    [{ vertical: -1, horizontal: 0 }, 'Top'],
    [{ vertical: -1, horizontal: 1 }, 'Top Right'],
    [{ vertical: 0, horizontal: -1 }, 'Left'],
    [{ vertical: 0, horizontal: 1 }, 'Right'],
    [{ vertical: 1, horizontal: -1 }, 'Bottom Left'],
    [{ vertical: 1, horizontal: 0 }, 'Bottom'],
    [{ vertical: 1, horizontal: 1 }, 'Bottom Right'],
  ]);

  neighbourCardMovingDownIndex: number | null = null;

  neighbourCardMovingUpIndex: number | null = null;

  pushNeighbourUpInOrder(index: number): void {
    if (
      index > 0 &&
      this.neighbourCardMovingDownIndex === null &&
      this.neighbourCardMovingUpIndex === null
    ) {
      this.swapNeighboursInOrdering(index - 1, index);
    }
  }

  pushNeighbourDownInOrder(index: number): void {
    if (
      index < this.neighbourVisitOrder.length - 1 &&
      this.neighbourCardMovingDownIndex === null &&
      this.neighbourCardMovingUpIndex === null
    ) {
      this.swapNeighboursInOrdering(index, index + 1);
    }
  }

  swapNeighboursInOrdering(indexGoingUp: number, indexGoingDown: number): void {
    const newNeighbourVisitOrder = cloneDeep(this.neighbourVisitOrder);

    this.neighbourCardMovingDownIndex = indexGoingDown;
    this.neighbourCardMovingUpIndex = indexGoingUp;

    setTimeout(() => {
      swap(newNeighbourVisitOrder, indexGoingUp, indexGoingDown);
      this.updateNeighbourVisitOrderEmitter.emit(newNeighbourVisitOrder);
      this.neighbourCardMovingDownIndex = null;
      this.neighbourCardMovingUpIndex = null;
    }, 1000);
  }

  getNeighbourCardClass(index: number): string {
    let classStr = 'neighbour-card';

    if (index === this.neighbourCardMovingDownIndex) {
      classStr += ' move-card-down';
    }

    if (index === this.neighbourCardMovingUpIndex) {
      classStr += ' move-card-up';
    }

    return classStr;
  }
}
