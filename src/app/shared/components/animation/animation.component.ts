import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  getValueFromRangeEvent,
  safeGetArrayIndex,
  wait,
} from '../../genericUtils';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.css'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimationComponent<AnimationFrame> {
  @Input() readonly isAnimationRunning!: boolean;

  @Input() readonly animationIndex!: number;

  @Input() readonly animationFrames!: AnimationFrame[];

  @Input() readonly updateAnimationFramesIfNeeded!: () => void;

  @Input() readonly needToUpdateAnimationFrames!: boolean;

  @Output() readonly setAnimationRunningEmitter = new EventEmitter<boolean>();

  @Output() readonly setAnimationIndexEmitter = new EventEmitter<number>();

  animationDelayMs = 0;

  prepareToAnimateAlgo(): void {
    this.updateAnimationFramesIfNeeded();
    this.resetAnimationIndexIfAtEnd();
    this.setAnimationRunningEmitter.emit(true);
    this.animateAlgoWaitingForStateUpdateFromParent();
  }

  animateAlgoWaitingForStateUpdateFromParent(): void {
    const interval = setInterval(async () => {
      if (this.canAnimationRun()) {
        clearInterval(interval);
        this.animateAlgo();
      }
    }, 0);
  }

  async animateAlgo(): Promise<void> {
    await wait(this.animationDelayMs);

    while (this.canAnimationRun()) {
      this.incrementAnimationIndex();
      await wait(this.animationDelayMs);
    }

    this.setAnimationRunningEmitter.emit(false);
  }

  canAnimationRun(): boolean {
    return (
      this.animationIndex < this.animationFrames.length - 1 &&
      this.isAnimationRunning
    );
  }

  resetAnimationIndexIfAtEnd(): void {
    if (this.safeGetAnimationIndex() === this.animationFrames.length - 1) {
      this.setAnimationIndexEmitter.emit(0);
    }
  }

  decrementAnimationIndex(): void {
    if (this.animationIndex > 0) {
      this.setAnimationIndexEmitter.emit(this.animationIndex - 1);
      this.updateAnimationFramesIfNeeded();
    }
  }

  incrementAnimationIndex(): void {
    if (this.animationIndex < this.animationFrames.length - 1) {
      this.setAnimationIndexEmitter.emit(this.animationIndex + 1);
      this.updateAnimationFramesIfNeeded();
    }
  }

  updateAnimationDelayMs(event: Event): void {
    this.animationDelayMs = getValueFromRangeEvent(event);
  }

  updateAnimationFrameIndex(event: Event): void {
    this.updateAnimationFramesIfNeeded();
    this.setAnimationIndexEmitter.emit(getValueFromRangeEvent(event));
  }

  safeGetAnimationIndex(): number {
    return safeGetArrayIndex(this.animationFrames, this.animationIndex);
  }
}
