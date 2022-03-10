import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { AnimationComponent } from './components/animation/animation.component';
import { AbstractModalComponent } from './components/abstract-modal/abstract-modal.component';

@NgModule({
  declarations: [DropdownComponent, AnimationComponent, AbstractModalComponent],
  imports: [CommonModule, SharedRoutingModule],
  exports: [DropdownComponent, AnimationComponent],
})
export class SharedModule {}
