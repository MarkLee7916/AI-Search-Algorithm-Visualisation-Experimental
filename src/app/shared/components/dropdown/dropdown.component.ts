import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent implements OnInit {
  @Input() readonly currentItem!: string;

  @Input() readonly items!: string[];

  @Input() readonly commentary!: string;

  @Input() readonly label!: string;

  @Output() readonly itemChangedEmitter = new EventEmitter<string>();

  isDropdownDisplayed = false;

  isTooltipDisplayed = false;

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  // To avoid triggering cd for whole tree, we subscribe to event using rxjs
  ngOnInit(): void {
    fromEvent(document, 'click').subscribe(this.onGlobalClick.bind(this));
  }

  // When state changes internally from an rxjs event, we need to run cd manually to update view
  onGlobalClick(event: Event): void {
    if (!this.elementRef.nativeElement?.contains(event.target)) {
      this.isDropdownDisplayed = false;
      this.changeDetectorRef.detectChanges();
    }
  }

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
}
