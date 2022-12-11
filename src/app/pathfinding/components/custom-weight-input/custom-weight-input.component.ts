import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-custom-weight-input',
  templateUrl: './custom-weight-input.component.html',
  styleUrls: [
    './custom-weight-input.component.css',
    '../tile/tile.component.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomWeightInputComponent {
  @Input() readonly shouldDisplayCustomWeightInput!: boolean;

  // Event emitter for when the user enters a custom weight and submits it
  @Output() readonly submitCustomWeightEmitter = new EventEmitter<number>();

  // Event emitter for when the user closes the custom weight input
  @Output() readonly closeCustomWeightInputEmitter = new EventEmitter<void>();

  hasUserEnteredInvalidInput = false;

  submitCustomWeight(customWeightStr: string): void {
    const customWeight = parseInt(customWeightStr, 10);

    if (!isNaN(customWeight) && customWeight > 0) {
      this.submitCustomWeightEmitter.emit(customWeight);
    } else {
      this.hasUserEnteredInvalidInput = true;
    }
  }

  closeCustomWeightInput(): void {
    this.closeCustomWeightInputEmitter.emit();
  }
}
