import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { fireEvent, render, screen } from '@testing-library/angular';
import { waitFor } from '@testing-library/dom';
import { assertNonNull, wait } from 'src/app/shared/genericUtils';
import { SharedModule } from 'src/app/shared/shared.module';
import { NQueensRoutingModule } from '../../n-queens-routing-module';
import { TileComponent } from '../tile/tile.component';
import { TutorialModalComponent } from '../tutorial-modal/tutorial-modal.component';
import { PageComponent } from './page.component';

describe('N-Queens Page', async () => {
  it('moves animation frames properly when buttons pressed', async () => {
    await render(PageComponent, {
      declarations: [TileComponent, PageComponent, TutorialModalComponent],
      imports: [
        CommonModule,
        NQueensRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'n-queens',
          component: PageComponent,
        },
      ],
    });

    // Get buttons to step back and forth through animations
    const prevAnimationFrameBtn = screen.getByText('◀');
    const nextAnimationFrameBtn = screen.getByText('▶️');

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
      declarations: [TileComponent, PageComponent, TutorialModalComponent],
      imports: [
        CommonModule,
        NQueensRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'n-queens',
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

  it('changes board size', async () => {
    await render(PageComponent, {
      declarations: [TileComponent, PageComponent, TutorialModalComponent],
      imports: [
        CommonModule,
        NQueensRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'n-queens',
          component: PageComponent,
        },
      ],
    });

    // Get slider
    const changeBoardSizeSlider = assertNonNull(
      document.getElementById('change-board-size')
    );

    // Slide to 8
    fireEvent.input(changeBoardSizeSlider, { target: { value: '8' } });

    // Expect number to have updated and board size to be 8 x 8 = 64
    expect(screen.queryByText('8')).not.toBeNull();
    expect(document.getElementsByClassName('tile').length).toBe(64);

    // Slide to 3
    fireEvent.input(changeBoardSizeSlider, { target: { value: '3' } });

    // Expect number to have updated and board size to be 8 x 8 = 64
    expect(screen.queryByText('3')).not.toBeNull();
    expect(document.getElementsByClassName('tile').length).toBe(9);
  });

  it('Switches to forward checking', async () => {
    await render(PageComponent, {
      declarations: [TileComponent, PageComponent, TutorialModalComponent],
      imports: [
        CommonModule,
        NQueensRoutingModule,
        BrowserModule,
        SharedModule,
      ],
      routes: [
        {
          path: 'n-queens',
          component: PageComponent,
        },
      ],
    });

    // Switch to forward checking mode
    fireEvent.click(screen.getByText(/Check When Assigning/));
    fireEvent.click(screen.getByText('Use Forward Checking'));

    // Expect all tiles to be green
    const tiles = document.getElementsByClassName('tile');
    Array.from(tiles).forEach((tile) => {
      expect((tile as HTMLElement).style.backgroundColor).toBe(
        'rgb(50, 205, 50)'
      );
    });

    // Switch to display domain being changed mode
    fireEvent.click(screen.getByText(/Display Domains of All Rows/));
    fireEvent.click(screen.getByText('Display Domain Being Changed'));

    // Expect all tiles to be white
    Array.from(tiles).forEach((tile) => {
      expect((tile as HTMLElement).style.backgroundColor).toBe('white');
    });
  });
});
