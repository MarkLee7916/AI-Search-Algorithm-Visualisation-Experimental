import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  template: '',
})
export class AbstractModalComponent {
  @Input() public readonly slides!: string[];

  @Output() public readonly hideEmitter = new EventEmitter<void>();

  public slideIndex = 0;

  public hideModal(): void {
    this.hideEmitter.emit();
  }

  public nextSlide(): void {
    if (this.slideIndex < this.slides.length - 1) {
      this.slideIndex++;
    }
  }

  public prevSlide(): void {
    if (this.slideIndex > 0) {
      this.slideIndex--;
    }
  }
}
