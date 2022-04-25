import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractModalComponent } from 'src/app/shared/components/abstract-modal/abstract-modal.component';

@Component({
  selector: 'app-save-grid-modal',
  templateUrl: './save-grid-modal.component.html',
  styleUrls: [
    './save-grid-modal.component.css',
    '../../../shared/components/abstract-modal/abstract-modal.component.css',
  ],
})
export class SaveGridModalComponent extends AbstractModalComponent {
  @Output() readonly newSaveEmitter = new EventEmitter<string>();

  // This is false until the user enters an invalid input
  hasEnteredInvalidInput = false;

  // If leaf values are valid, notify parent component and close modal, else display error message
  createNewSave(name: string): void {
    if (name.length > 0) {
      this.newSaveEmitter.emit(name);
      this.hideModal();
    } else {
      this.hasEnteredInvalidInput = true;
    }
  }
}
