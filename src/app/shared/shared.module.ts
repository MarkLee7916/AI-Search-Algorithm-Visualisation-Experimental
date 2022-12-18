import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { AnimationComponent } from './components/animation/animation.component';
import { AbstractModalComponent } from './components/abstract-modal/abstract-modal.component';
import { VisibleDirective } from './directives/visible.directive';
import { InvisibleDirective } from './directives/invisible.directive';

@NgModule({
  declarations: [
    DropdownComponent,
    AnimationComponent,
    AbstractModalComponent,
    VisibleDirective,
    InvisibleDirective,
  ],
  imports: [CommonModule, SharedRoutingModule],
  exports: [
    DropdownComponent,
    AnimationComponent,
    VisibleDirective,
    InvisibleDirective,
  ],
})
export class SharedModule {}
