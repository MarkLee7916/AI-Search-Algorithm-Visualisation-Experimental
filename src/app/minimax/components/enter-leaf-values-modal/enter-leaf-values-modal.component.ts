import { Component, Output, EventEmitter } from '@angular/core';
import { AbstractModalComponent } from 'src/app/shared/components/abstract-modal/abstract-modal.component';
import { filterStr, isCharNumeric } from 'src/app/shared/genericUtils';
import { LEAF_COUNT, TREE_DEPTH } from '../../models/tree';

@Component({
  selector: 'app-enter-leaf-values-modal',
  templateUrl: './enter-leaf-values-modal.component.html',
  styleUrls: [
    '../../../shared/components/abstract-modal/abstract-modal.component.css',
    './enter-leaf-values-modal.component.css',
  ],
})
export class EnterLeafValuesModalComponent extends AbstractModalComponent {
  @Output() readonly updateLeafValuesEmitter = new EventEmitter<number[]>();

  readonly LEAF_COUNT = LEAF_COUNT;

  hasEnteredInvalidInput = false;

  updateLeafValues(leafValuesStr: string): void {
    const leafValues = this.parseLeafValues(leafValuesStr);

    if (leafValues !== null && leafValues.length > 0) {
      this.updateLeafValuesEmitter.emit(leafValues);
      this.hideModal();
    } else {
      this.hasEnteredInvalidInput = true;
    }
  }

  parseLeafValues(leafValuesStr: string): number[] | null {
    leafValuesStr = this.removeUserInputMistakesForLeafValuesStr(leafValuesStr);

    let leafValues: number[] | null;

    try {
      leafValues = JSON.parse(`[${leafValuesStr}]`);
    } catch {
      leafValues = null;
    }

    return leafValues;
  }

  removeUserInputMistakesForLeafValuesStr(leafValuesStr: string): string {
    return this.removeRepeatedCommas(
      this.removeTrailingCommas(this.removeInvalidChars(leafValuesStr))
    );
  }

  removeInvalidChars(leafValuesStr: string): string {
    return filterStr(
      leafValuesStr,
      (char) => isCharNumeric(char) || char === ','
    );
  }

  removeTrailingCommas(str: string): string {
    while (str[0] === ',' && str.length > 1) {
      str = str.substring(1, str.length);
    }

    while (str[str.length - 1] === ',' && str.length > 1) {
      str = str.substring(0, str.length - 1);
    }

    return str;
  }

  removeRepeatedCommas(str: string): string {
    const bounds = this.getIndiceBoundsOutsideRepeatedCommas(str);

    let filteredStr = '';

    bounds.forEach(([lower, upper]) => {
      filteredStr += str.substring(lower, upper);
    });

    return filteredStr;
  }

  getIndiceBoundsOutsideRepeatedCommas(str: string): [number, number][] {
    const bounds: [number, number][] = [];

    let startBound = 0;
    let endBound = 0;

    for (let i = 0; i <= str.length; i++) {
      if (str[i] === ',' || i === str.length) {
        endBound = i + 1;

        bounds.push([startBound, endBound]);

        while (str[i] === ',') {
          i++;
        }

        startBound = i;
      }
    }

    return bounds;
  }
}
