import { Component, Input, EventEmitter, Output } from '@angular/core';
import { AbstractModalComponent } from 'src/app/shared/components/abstract-modal/abstract-modal.component';

@Component({
  selector: 'app-load-saved-grid-modal',
  templateUrl: './load-saved-grid-modal.component.html',
  styleUrls: [
    './load-saved-grid-modal.component.css',
    '../../../shared/components/abstract-modal/abstract-modal.component.css',
  ],
})
export class LoadSavedGridModalComponent extends AbstractModalComponent {
  @Input() readonly saveNames!: string[];

  @Output() readonly loadSaveEmitter = new EventEmitter<string>();

  @Output() readonly deleteSaveEmitter = new EventEmitter<string>();

  loadSave(saveName: string): void {
    this.loadSaveEmitter.emit(saveName);
    this.hideModal();
  }

  deleteSave(saveName: string): void {
    this.deleteSaveEmitter.emit(saveName);
  }
}
