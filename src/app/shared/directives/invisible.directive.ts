import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[invisible]',
})
export class InvisibleDirective implements OnChanges {
  @Input() invisible!: boolean;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(_: SimpleChanges): void {
    this.elementRef.nativeElement.style.visibility = this.invisible
      ? 'hidden'
      : 'visible';
  }
}
