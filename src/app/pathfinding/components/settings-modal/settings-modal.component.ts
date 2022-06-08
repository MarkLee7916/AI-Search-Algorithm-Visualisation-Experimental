import { Component, EventEmitter, Input, Output } from '@angular/core';
import cloneDeep from 'clone-deep';
import { AbstractModalComponent } from 'src/app/shared/components/abstract-modal/abstract-modal.component';
import { swap } from 'src/app/shared/genericUtils';
import { UncheckedObjMap } from 'src/app/shared/models/uncheckedObjMap';
import { Neighbour } from '../../models/grid';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: [
    './settings-modal.component.css',
    '../../../shared/components/abstract-modal/abstract-modal.component.css',
  ],
})
export class SettingsModalComponent extends AbstractModalComponent {
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

  pushNeighbourUpInOrder(index: number): void {
    if (index > 0) {
      this.swapNeighboursInOrdering(index - 1, index);
    }
  }

  pushNeighbourDownInOrder(index: number): void {
    if (index < this.neighbourVisitOrder.length - 1) {
      this.swapNeighboursInOrdering(index, index + 1);
    }
  }

  swapNeighboursInOrdering(i: number, j: number): void {
    const newNeighbourVisitOrder = cloneDeep(this.neighbourVisitOrder);

    swap(newNeighbourVisitOrder, i, j);

    this.updateNeighbourVisitOrderEmitter.emit(newNeighbourVisitOrder);
  }
}
