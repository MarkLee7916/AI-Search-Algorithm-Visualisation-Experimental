import { Component } from '@angular/core';
import { AbstractModalComponent } from 'src/app/shared/components/abstract-modal/abstract-modal.component';

@Component({
  selector: 'app-tutorial-modal',
  templateUrl: './tutorial-modal.component.html',
  styleUrls: [
    '../../../shared/components/abstract-modal/abstract-modal.component.css',
  ],
})
export class TutorialModalComponent extends AbstractModalComponent {
  readonly Slide = TutorialModalSlide;
}

export enum TutorialModalSlide {
  Intro = 'Intro',
  MappingOntoCSP = 'MappingOntoCSP',
  CheckingType = 'CheckingType',
  Highlighting = 'Highlighting',
  SteppingThroughAnimations = 'SteppingThroughAnimations',
  Animating = 'Animating',
  Conclusion = 'Conclusion',
}
