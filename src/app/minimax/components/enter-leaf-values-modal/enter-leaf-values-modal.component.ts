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
  // Call parent component's callback with the leaf values the user currently has entered
  @Output() readonly updateLeafValuesEmitter = new EventEmitter<number[]>();

  // Number of leaves in the tree, used for displaying a message on this modal
  readonly LEAF_COUNT = LEAF_COUNT;

  // This is false until the user enters an invalid input
  hasEnteredInvalidInput = false;

  // If leaf values are valid, notify parent component and close modal, else display error message
  updateLeafValues(leafValuesStr: string): void {
    const leafValues = this.parseLeafValues(leafValuesStr);

    if (leafValues !== null && leafValues.length > 0) {
      this.updateLeafValuesEmitter.emit(leafValues);
      this.hideModal();
    } else {
      this.hasEnteredInvalidInput = true;
    }
  }

  // Parse the leaf values string into an array of numbers, returning null if invalid parse
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

  // Remove any common user mistakes from the leaf values string by composing different functions
  removeUserInputMistakesForLeafValuesStr(leafValuesStr: string): string {
    return this.removeRepeatedCommas(
      this.removeTrailingCommas(this.removeInvalidChars(leafValuesStr))
    );
  }

  // Remove any characters that aren't a comma or a number i.e [1a,2b] -> [1,2]
  removeInvalidChars(leafValuesStr: string): string {
    return filterStr(
      leafValuesStr,
      (char) => isCharNumeric(char) || char === ','
    );
  }

  // Remove any commas from the start and end of the string i.e [,1,2,] -> [1,2]
  removeTrailingCommas(str: string): string {
    while (str[0] === ',' && str.length > 1) {
      str = str.substring(1, str.length);
    }

    while (str[str.length - 1] === ',' && str.length > 1) {
      str = str.substring(0, str.length - 1);
    }

    return str;
  }

  // Remove any commas that have been repeated i.e [1,,,2] -> [1,2]
  removeRepeatedCommas(str: string): string {
    const bounds = this.getIndiceBoundsOutsideRepeatedCommas(str);

    let filteredStr = '';

    bounds.forEach(([lower, upper]) => {
      filteredStr += str.substring(lower, upper);
    });

    return filteredStr;
  }

  // Return a list of indice pairs that specify where in the string doesn't have repeated commas
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
