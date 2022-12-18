import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[visible]',
})
export class VisibleDirective implements OnChanges {
  @Input() visible!: boolean;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(_: SimpleChanges): void {
    this.elementRef.nativeElement.style.visibility = this.visible
      ? 'visible'
      : 'hidden';
  }
}
