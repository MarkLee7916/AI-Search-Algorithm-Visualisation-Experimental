import { Component } from '@angular/core';
import { AbstractModalComponent } from 'src/app/shared/components/abstract-modal/abstract-modal.component';
import { TutorialModalSlide } from '../tutorial-modal/tutorial-modal.component';

@Component({
  selector: 'app-theory-modal',
  templateUrl: './theory-modal.component.html',
  styleUrls: [
    '../../../shared/components/abstract-modal/abstract-modal.component.css',
  ],
})
export class TheoryModalComponent extends AbstractModalComponent {
  readonly Slide = TheoryModalSlide;
}

export enum TheoryModalSlide {
  Intro = 'Intro',
  Uninformed = 'Uninformed',
  Weighted = 'Weighted',
  Heuristics = 'Heuristics',
  AStar = 'AStar',
}
