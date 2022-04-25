import { Component, Input } from '@angular/core';
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

  partitionSavesIntoSeparateSlides(saveNames: string[]): string[][] {
    const saveSlides = [];

    for (let i = 0; i < saveNames.length; i += 5) {
      saveSlides.push(saveNames.slice(i, i + 5));
    }

    return saveSlides;
  }
}
