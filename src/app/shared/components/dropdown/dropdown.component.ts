import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  @Input() readonly currentItem!: string;

  @Input() readonly items!: string[];

  @Input() readonly commentary!: string;

  @Input() readonly label!: string;

  @Output() readonly itemChangedEmitter = new EventEmitter<string>();

  isDropdownDisplayed = false;

  isTooltipDisplayed = false;

  constructor(private elementRef: ElementRef) {}

  toggleDropdown(): void {
    this.isDropdownDisplayed = !this.isDropdownDisplayed;
    this.hideTooltip();
  }

  handleDropdownItemClick(item: string): void {
    this.toggleDropdown();
    this.itemChangedEmitter.emit(item);
  }

  displayTooltip(): void {
    this.isTooltipDisplayed = true;
  }

  hideTooltip(): void {
    this.isTooltipDisplayed = false;
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this.elementRef.nativeElement?.contains(event.target)) {
      this.isDropdownDisplayed = false;
    }
  }
}
