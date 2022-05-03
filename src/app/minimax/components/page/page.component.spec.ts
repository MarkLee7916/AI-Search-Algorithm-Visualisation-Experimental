import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {
  fireEvent,
  getByPlaceholderText,
  queryByText,
  render,
  screen,
} from '@testing-library/angular';
import { assertNonNull } from 'src/app/shared/genericUtils';
import { SharedModule } from 'src/app/shared/shared.module';
import { MinimaxRoutingModule } from '../../minimax-routing.module';
import { InfinitySymbolPipe } from '../../pipes/infinity-symbol.pipe';
import { EnterLeafValuesModalComponent } from '../enter-leaf-values-modal/enter-leaf-values-modal.component';
import { NodeComponent } from '../node/node.component';
import { TutorialModalComponent } from '../tutorial-modal/tutorial-modal.component';
import { PageComponent } from './page.component';

describe('Minimax Page', () => {
  it('moves animation frames properly when buttons pressed', async () => {
    await render(PageComponent, {
      declarations: [
        InfinitySymbolPipe,
        NodeComponent,
        EnterLeafValuesModalComponent,
        PageComponent,
        TutorialModalComponent,
      ],
      imports: [
        CommonModule,
        MinimaxRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'minimax',
          component: PageComponent,
        },
      ],
    });

    // Get buttons to step back and forth through animations
    const prevAnimationFrameBtn = screen.getByText('⏴︎');
    const nextAnimationFrameBtn = screen.getByText('⏵︎');

    // Step forward and check we're not on first animation frame
    fireEvent.click(nextAnimationFrameBtn);
    expect(screen.queryByText('Nothing has happened yet!')).toBeNull();

    // Step back and check we're back on first animation frame
    fireEvent.click(prevAnimationFrameBtn);
    expect(screen.queryByText('Nothing has happened yet!')).not.toBeNull();

    // Step back again and check we're still on first animation frame
    fireEvent.click(prevAnimationFrameBtn);
    expect(screen.queryByText('Nothing has happened yet!')).not.toBeNull();
  });

  it('moves through tutorial modal slides properly', async () => {
    await render(PageComponent, {
      declarations: [
        InfinitySymbolPipe,
        NodeComponent,
        EnterLeafValuesModalComponent,
        PageComponent,
        TutorialModalComponent,
      ],
      imports: [
        CommonModule,
        MinimaxRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'minimax',
          component: PageComponent,
        },
      ],
    });

    // Expect tutorial modal to appear when app loaded
    expect(screen.queryByText(/Welcome/)).not.toBeNull();

    // Skip to last slide
    let nextSlideBtn = screen.queryByText('Next Slide');
    while (nextSlideBtn !== null) {
      fireEvent.click(nextSlideBtn);
      nextSlideBtn = screen.queryByText('Next Slide');
    }

    // Expect final slide to be displayed
    expect(screen.queryByText(/Everything/)).not.toBeNull();

    // Skip back to first slide
    let prevSlideBtn = screen.queryByText('Previous Slide');
    while (prevSlideBtn !== null) {
      fireEvent.click(prevSlideBtn);
      prevSlideBtn = screen.queryByText('Previous Slide');
    }

    // Expect first slide to be displayed
    expect(screen.queryByText(/Welcome/)).not.toBeNull();

    // Close tutorial and expect it to not be on screen
    const skipTutorialBtn = screen.getByText('Skip Tutorial');
    fireEvent.click(skipTutorialBtn);
    expect(screen.queryByText('Skip Tutorial')).toBeNull();
    expect(screen.queryByText('Finish Tutorial')).toBeNull();
    expect(screen.queryByText('Previous Slide')).toBeNull();
    expect(screen.queryByText('Next Slide')).toBeNull();
  });

  it('enters leaf values properly', async () => {
    await render(PageComponent, {
      declarations: [
        InfinitySymbolPipe,
        NodeComponent,
        EnterLeafValuesModalComponent,
        PageComponent,
        TutorialModalComponent,
      ],
      imports: [
        CommonModule,
        MinimaxRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'minimax',
          component: PageComponent,
        },
      ],
    });

    // Open custom leaf values modal
    fireEvent.click(screen.getByText('Add Custom Leaf Values'));

    // Expect error to be displayed because there was no input
    const saveAndCloseBtn = screen.getByText('Save And Close');
    fireEvent.click(saveAndCloseBtn);
    expect(screen.queryByText(/Input is not a valid/)).not.toBeNull();

    // Expect error to be displayed because input was invalid
    const leafValuesInput = assertNonNull(
      document.querySelector('.modal-input-item')
    );
    fireEvent.change(leafValuesInput, { target: { value: ',a,bba,' } });
    fireEvent.click(saveAndCloseBtn);
    expect(screen.queryByText(/Input is not a valid/)).not.toBeNull();

    // Expect valid input to be accepted, closing modal
    fireEvent.change(leafValuesInput, {
      target: { value: '123a456,,, 789,, 3abc' },
    });
    fireEvent.click(saveAndCloseBtn);
    expect(screen.queryByText('Save And Close')).toBeNull();
    expect(screen.queryByText('Close Without Saving')).toBeNull();

    // Expect numbers to have been rendered on screen and parsed properly
    expect(screen.queryByText('v: 123456')).not.toBeNull();
    expect(screen.queryByText('v: 789')).not.toBeNull();
  });

  it('shows legend when hovering over the button', async () => {
    await render(PageComponent, {
      declarations: [
        InfinitySymbolPipe,
        NodeComponent,
        EnterLeafValuesModalComponent,
        PageComponent,
        TutorialModalComponent,
      ],
      imports: [
        CommonModule,
        MinimaxRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'minimax',
          component: PageComponent,
        },
      ],
    });

    const showLegendBtn = screen.getByText('Show Legend');

    // Expect legend tooltip to show when hovering
    fireEvent.mouseEnter(showLegendBtn);
    expect(screen.queryByText('🟥 - Not Considered')).not.toBeNull();

    // Expect legend tooltip to not show when mouse is taken away
    fireEvent.mouseLeave(showLegendBtn);
    expect(screen.queryByText('🟥 - Not Considered')).toBeNull();
  });

  it('runs quiz mode properly', async () => {
    await render(PageComponent, {
      declarations: [
        InfinitySymbolPipe,
        NodeComponent,
        EnterLeafValuesModalComponent,
        PageComponent,
        TutorialModalComponent,
      ],
      imports: [
        CommonModule,
        MinimaxRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'minimax',
          component: PageComponent,
        },
      ],
    });

    // Open custom leaf values modal
    fireEvent.click(screen.getByText('Add Custom Leaf Values'));

    // Enter input where all leaves are 1
    fireEvent.rateChange(
      assertNonNull(document.querySelector('.modal-input-item')),
      {
        target: { value: '1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1' },
      }
    );

    // Close custom leaf values modal
    fireEvent.click(screen.getByText('Save And Close'));

    // Switch to quiz mode using dropdown
    fireEvent.click(screen.getByText(/Visualisation Mode/));
    fireEvent.click(screen.getByText('Quiz Mode'));

    // Expect to be in quiz mode
    expect(screen.queryByText(/∞ or -∞/)).not.toBeNull();

    let nodesToGuess = screen
      .queryAllByText('v: ?')
      .map((node) => assertNonNull(node.parentNode as HTMLElement));

    while (nodesToGuess.length > 0) {
      // Open guess menu
      fireEvent.click(nodesToGuess[0]);

      // Expect wrong guess to display corresponding message
      fireEvent.click(screen.getByText('∞'));
      expect(screen.queryByText('Incorrect! Try again')).not.toBeNull();

      // Expect right guess to display corresponding message
      const guessInput = screen.getByRole('textbox');
      fireEvent.change(guessInput, { target: { value: '1' } });
      fireEvent.keyUp(guessInput, {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
      });
      expect(screen.queryByText('Correct!')).not.toBeNull();

      nodesToGuess = screen
        .queryAllByText('v: ?')
        .map((node) => assertNonNull(node.parentNode as HTMLElement));
    }
  });

  it('switches to alpha beta pruning mode', async () => {
    await render(PageComponent, {
      declarations: [
        InfinitySymbolPipe,
        NodeComponent,
        EnterLeafValuesModalComponent,
        PageComponent,
        TutorialModalComponent,
      ],
      imports: [
        CommonModule,
        MinimaxRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'minimax',
          component: PageComponent,
        },
      ],
    });

    // Switch to alpha beta mode using dropdown
    const modeDropdownBtn = screen.getByText(/No Pruning/);
    fireEvent.click(modeDropdownBtn);
    const useAlphaBetaBtn = screen.getByText('Use Alpha Beta Pruning');
    fireEvent.click(useAlphaBetaBtn);

    // Expect to be in alpha beta mode
    expect(screen.queryAllByText(/α/)).not.toEqual([]);
  });

  it('generates a new tree', async () => {
    await render(PageComponent, {
      declarations: [
        InfinitySymbolPipe,
        NodeComponent,
        EnterLeafValuesModalComponent,
        PageComponent,
        TutorialModalComponent,
      ],
      imports: [
        CommonModule,
        MinimaxRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'minimax',
          component: PageComponent,
        },
      ],
    });

    const firstLeafValueDisplay = screen.getAllByText(/v: +/)[0].innerHTML;

    // Update tree
    fireEvent.click(screen.getByText('New Tree'));

    const secondLeafValueDisplay = screen.getAllByText(/v: +/)[0].innerHTML;

    expect(firstLeafValueDisplay).not.toBe(secondLeafValueDisplay);
  });
});
