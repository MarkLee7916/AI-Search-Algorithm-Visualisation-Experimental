import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AbstractModalComponent } from 'src/app/shared/components/abstract-modal/abstract-modal.component';

@Component({
  selector: 'app-tutorial-modal',
  templateUrl: './tutorial-modal.component.html',
  styleUrls: [
    '../../../shared/components/abstract-modal/abstract-modal.component.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialModalComponent extends AbstractModalComponent {
  readonly Slide = TutorialModalSlide;
}

export enum TutorialModalSlide {
  Intro = 'Intro',
  Grid = 'Grid',
  BarriersAndWeights = 'BarriersAndWeights',
  CustomWeights = 'CustomWeights',
  MazeGen = 'MazeGen',
  StartAndGoal = 'StartAndGoal',
  Animating = 'Animating',
  SteppingThroughAnimations = 'SteppingThroughAnimations',
  SavingGrid = 'SavingGrid',
  QuizMode = 'QuizMode',
  Conclusion = 'Conclusion',
}
